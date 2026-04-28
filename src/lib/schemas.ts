import { z } from "zod";

export const SmartInputSchema = z.object({
  people: z.array(z.object({
    tempId: z.string().describe("Mã định danh tạm thời do AI tạo (VD: P1, P2) để liên kết."),
    fullName: z.string().describe("Họ và tên đầy đủ"),
    birthYear: z.number().optional().nullable().describe("Năm sinh nếu có"),
    deathYear: z.number().optional().nullable().describe("Năm mất nếu có"),
    gender: z.enum(["Male", "Female", "Unknown"]).describe("Giới tính dựa theo danh xưng (Cụ ông, Bà, etc.)"),
  })).describe("Danh sách tất cả những người được nhắc đến trong văn bản"),
  
  unions: z.array(z.object({
    unionTempId: z.string().describe("Mã định danh tạm thời cho hôn nhân (VD: U1, U2)."),
    husbandTempId: z.string().optional().nullable().describe("tempId của người chồng (nếu có)"),
    wifeTempId: z.string().optional().nullable().describe("tempId của người vợ (nếu có)"),
    status: z.enum(["Married", "Divorced", "Unmarried_Partners", "Unknown"]).describe("Trạng thái hôn nhân"),
  })).describe("Danh sách các cặp vợ chồng/hôn nhân. Nếu văn bản nói A sinh ra B mà KHÔNG nhắc tới vợ/chồng của A, AI vẫn PHẢI TẠO ra 1 union (ví dụ husbandTempId=A, wifeTempId=null) để gán con vào."),
  
  children: z.array(z.object({
    childTempId: z.string().describe("tempId của người con"),
    unionTempId: z.string().describe("tempId của cuộc hôn nhân (unionTempId) sinh ra đứa trẻ này"),
    isAdopted: z.boolean().default(false).describe("Có phải con nuôi không?"),
  })).describe("Danh sách con cái gắn liền với cuộc hôn nhân"),
});

export type SmartInputResult = z.infer<typeof SmartInputSchema>;
