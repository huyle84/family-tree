"use server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function registerAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  if (!email || !password || !fullName) {
    return { error: "Vui lòng nhập đủ các trường." };
  }

  try {
    const existingAccount = await prisma.userAccount.findUnique({
      where: { email },
    });

    if (existingAccount) {
      return { error: "Email này đã được sử dụng." };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Sử dụng transaction để tạo cả Person và UserAccount
    await prisma.$transaction(async (tx) => {
      // Vì bảng Person của chúng ta sinh UUID id nên phải tạo nó trước,
      // hoặc lấy id của userAccount để update.
      // Dựa vào schema, Person có userAccountId là khóa phụ.
      const newAccount = await tx.userAccount.create({
        data: {
          email,
          passwordHash,
          role: "Member", // Mặc định là Member
        },
      });

      await tx.person.create({
        data: {
          fullName,
          gender: "Unknown", // Sẽ cập nhật sau
          userAccountId: newAccount.id,
        },
      });
    });

    return { success: "Đăng ký thành công! Vui lòng đăng nhập." };
  } catch (error) {
    console.error("Register Error:", error);
    return { error: "Có lỗi xảy ra trong quá trình đăng ký." };
  }
}

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Vui lòng nhập email và mật khẩu." };
  }

  try {
    const user = await prisma.userAccount.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Email hoặc mật khẩu không chính xác." };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return { error: "Email hoặc mật khẩu không chính xác." };
    }

    if (user.status === "Pending") {
      return { error: "Tài khoản của bạn đang chờ Quản trị viên phê duyệt." };
    }
    
    if (user.status === "Rejected") {
      return { error: "Tài khoản của bạn đã bị từ chối hoặc vô hiệu hóa." };
    }

    await createSession(user.id, user.role);
    
    // Redirect dựa theo quyền
    if (user.role === "Admin" || user.role === "Moderator") {
        return { redirect: "/admin" };
    }

    return { redirect: "/tree" };
  } catch (error) {
    console.error("Login Error:", error);
    return { error: "Không thể xử lý yêu cầu lúc này." };
  }
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
