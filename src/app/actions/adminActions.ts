"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function approveUserAction(userId: string) {
  const session = await getSession();
  if (!session || (session.role !== "Admin" && session.role !== "Moderator")) {
    return { error: "Không đủ quyền hạn." };
  }

  try {
    await prisma.userAccount.update({
      where: { id: userId },
      data: { status: "Active" },
    });
    revalidatePath("/admin/users");
    return { success: "Đã phê duyệt tài khoản." };
  } catch (error) {
    return { error: "Không thể phê duyệt." };
  }
}

export async function rejectUserAction(userId: string) {
  const session = await getSession();
  if (!session || (session.role !== "Admin" && session.role !== "Moderator")) {
    return { error: "Không đủ quyền hạn." };
  }

  try {
    await prisma.userAccount.update({
      where: { id: userId },
      data: { status: "Rejected" },
    });
    revalidatePath("/admin/users");
    return { success: "Đã từ chối tài khoản." };
  } catch (error) {
    return { error: "Không thể từ chối." };
  }
}

export async function setRoleAction(userId: string, newRole: string) {
  const session = await getSession();
  if (!session || session.role !== "Admin") {
    return { error: "Chỉ Admin mới có thể phân quyền." };
  }

  try {
    await prisma.userAccount.update({
      where: { id: userId },
      data: { role: newRole },
    });
    revalidatePath("/admin/users");
    return { success: `Đã cập nhật quyền thành ${newRole}.` };
  } catch (error) {
    return { error: "Không thể phân quyền." };
  }
}

export async function deleteUserAction(userId: string) {
  const session = await getSession();
  if (!session || session.role !== "Admin") {
    return { error: "Chỉ Admin mới có thể xóa tài khoản." };
  }

  try {
    await prisma.userAccount.delete({
      where: { id: userId },
    });
    revalidatePath("/admin/users");
    return { success: "Đã xóa tài khoản." };
  } catch (error) {
    return { error: "Lỗi hệ thống. Có thể tài khoản đang liên kết với hồ sơ." };
  }
}

// ===================
// MANUAL INPUT ACTIONS
// ===================

export async function createPersonAction(formData: FormData) {
  const session = await getSession();
  if (!session || (session.role !== "Admin" && session.role !== "Editor" && session.role !== "Moderator")) return { error: "Unauthorized" };

  const fullName = formData.get("fullName") as string;
  const aliases = formData.get("aliases") as string;
  const gender = formData.get("gender") as string;
  const familyOrder = formData.get("familyOrder") ? parseInt(formData.get("familyOrder") as string) : null;
  const birthYear = formData.get("birthYear") ? parseInt(formData.get("birthYear") as string) : null;
  const deathYear = formData.get("deathYear") ? parseInt(formData.get("deathYear") as string) : null;
  
  const origin = formData.get("origin") as string;
  const birthPlace = formData.get("birthPlace") as string;
  const deathPlace = formData.get("deathPlace") as string;
  const restingPlace = formData.get("restingPlace") as string;
  
  const education = formData.get("education") as string;
  const career = formData.get("career") as string;
  const merits = formData.get("merits") as string;
  const notes = formData.get("notes") as string;

  try {
    const birthDate = birthYear ? new Date(birthYear, 0, 1) : null;
    const deathDate = deathYear ? new Date(deathYear, 0, 1) : null;

    await prisma.person.create({
      data: {
        fullName,
        aliases,
        gender: gender || "Unknown",
        familyOrder,
        birthDate,
        deathDate,
        origin,
        birthPlace,
        deathPlace,
        restingPlace,
        education,
        career,
        merits,
        notes
      }
    });
    return { success: "Tạo mới cá nhân thành công." };
  } catch (err: any) {
    return { error: "Lỗi: " + err.message };
  }
}

export async function createUnionAction(formData: FormData) {
  const session = await getSession();
  if (!session || (session.role !== "Admin" && session.role !== "Editor" && session.role !== "Moderator")) return { error: "Unauthorized" };

  const husbandId = formData.get("husbandId") as string;
  const wifeId = formData.get("wifeId") as string;
  const status = formData.get("status") as string;

  try {
    await prisma.$transaction(async (tx) => {
      const newUnion = await tx.union.create({
        data: { status: status || "Unknown" }
      });

      if (husbandId) {
        await tx.unionPerson.create({
          data: { unionId: newUnion.id, personId: husbandId, role: "Husband" }
        });
      }
      
      if (wifeId) {
        await tx.unionPerson.create({
          data: { unionId: newUnion.id, personId: wifeId, role: "Wife" }
        });
      }
    });
    return { success: "Khởi tạo quan hệ hôn nhân thành công." };
  } catch (err: any) {
    return { error: "Lỗi: " + err.message };
  }
}

export async function createChildAction(formData: FormData) {
  const session = await getSession();
  if (!session || (session.role !== "Admin" && session.role !== "Editor" && session.role !== "Moderator")) return { error: "Unauthorized" };

  const childId = formData.get("childId") as string;
  const unionId = formData.get("unionId") as string;
  const isAdopted = formData.get("isAdopted") === "on";

  if (!childId || !unionId) return { error: "Vui lòng chọn Con và Hôn nhân của bố mẹ." };

  try {
    await prisma.child.create({
      data: {
        personId: childId,
        unionId: unionId,
        isAdopted,
      }
    });
    return { success: "Liên kết con cái thành công." };
  } catch (err: any) {
    return { error: "Lỗi liên kết (Có thể đã tồn tại)." };
  }
}
