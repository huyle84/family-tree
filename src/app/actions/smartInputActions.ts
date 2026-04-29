"use server";

import { z } from "zod";
import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

import { SmartInputSchema, SmartInputResult } from "@/lib/schemas";

export async function parseSmartInputAction(text: string) {
  // Kiểm tra quyền (chỉ Admin/Editor mới được dùng)
  const session = await getSession();
  if (!session || (session.role !== "Admin" && session.role !== "Editor" && session.role !== "Moderator")) {
    return { error: "Bạn không có quyền sử dụng tính năng này." };
  }

  if (!process.env.GEMINI_API_KEY) {
    return { error: "Chưa cấu hình GEMINI_API_KEY trong hệ thống." };
  }

  try {
    // Khởi tạo Google Provider với custom API Key
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY || "",
    });

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: SmartInputSchema,
      prompt: `Bạn là một chuyên gia lập cây gia phả. Hãy phân tích đoạn văn bản sau và trích xuất thông tin thành cấu trúc JSON.
Đoạn văn bản: "${text}"

Quy tắc quan trọng:
1. Mỗi người phải có một tempId duy nhất.
2. Một người con (children) LUÔN LUÔN phải thuộc về một cuộc hôn nhân (unionTempId), KHÔNG BAO GIỜ nối trực tiếp vào một người.
3. Nếu văn bản nói "A có con là B" mà không nhắc tới mẹ của B, bạn PHẢI TẠO MỚI một 'union' có chồng là A (hoặc vợ là A) và người còn lại là null, sau đó đặt B làm con của union đó.
4. Tự suy luận giới tính qua danh từ (Ông, Cụ ông, Bố -> Male; Bà, Mẹ, Cụ bà -> Female).`,
    });

    return { success: true, data: object };
  } catch (error: any) {
    console.error("AI Parse Error:", error);
    return { error: "Lỗi trong quá trình phân tích ngôn ngữ tự nhiên: " + error.message };
  }
}

export async function commitSmartInputAction(parsedData: SmartInputResult) {
  const session = await getSession();
  if (!session || (session.role !== "Admin" && session.role !== "Editor" && session.role !== "Moderator")) {
    return { error: "Bạn không có quyền sử dụng tính năng này." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Tạo bản đồ ánh xạ từ TempID sang UUID thật
      const tempIdToUuid: Record<string, string> = {};

      // Tạo tất cả Person
      for (const p of parsedData.people) {
        const birthDate = p.birthYear ? new Date(p.birthYear, 0, 1) : null;
        const deathDate = p.deathYear ? new Date(p.deathYear, 0, 1) : null;

        const newPerson = await tx.person.create({
          data: {
            fullName: p.fullName,
            aliases: p.aliases,
            gender: p.gender,
            birthDate,
            deathDate,
            familyOrder: p.familyOrder,
            origin: p.origin,
            birthPlace: p.birthPlace,
            deathPlace: p.deathPlace,
            restingPlace: p.restingPlace,
            education: p.education,
            career: p.career,
            merits: p.merits,
          },
        });
        tempIdToUuid[p.tempId] = newPerson.id;
      }

      // 2. Tạo bản đồ cho Unions
      const unionTempIdToUuid: Record<string, string> = {};

      for (const u of parsedData.unions) {
        const newUnion = await tx.union.create({
          data: {
            status: u.status,
          },
        });
        unionTempIdToUuid[u.unionTempId] = newUnion.id;

        // Nối Chồng vào Union
        if (u.husbandTempId && tempIdToUuid[u.husbandTempId]) {
          await tx.unionPerson.create({
            data: {
              unionId: newUnion.id,
              personId: tempIdToUuid[u.husbandTempId],
              role: "Husband",
            },
          });
        }

        // Nối Vợ vào Union
        if (u.wifeTempId && tempIdToUuid[u.wifeTempId]) {
          await tx.unionPerson.create({
            data: {
              unionId: newUnion.id,
              personId: tempIdToUuid[u.wifeTempId],
              role: "Wife",
            },
          });
        }
      }

      // 3. Tạo các Child Links
      for (const c of parsedData.children) {
        const childId = tempIdToUuid[c.childTempId];
        const unionId = unionTempIdToUuid[c.unionTempId];

        if (childId && unionId) {
          await tx.child.create({
            data: {
              unionId: unionId,
              personId: childId,
              isAdopted: c.isAdopted,
              isAcknowledged: true,
            },
          });
        }
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("DB Commit Error:", error);
    return { error: "Lỗi lưu Database: " + error.message };
  }
}
