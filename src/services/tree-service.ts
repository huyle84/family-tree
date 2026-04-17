import prisma from '@/lib/db';

export interface PersonData {
  fullName: string;
  gender: string;
  birthDate?: string;
}

// 1. Logic Thêm một Đứa con mới thông qua Transaction
export async function addChildNode(
  childData: PersonData,
  parentUnionId: string,
  isAdopted: boolean = false
) {
  return await prisma.$transaction(async (tx) => {
    // Tạo Person mới
    const newChild = await tx.person.create({
      data: {
        fullName: childData.fullName,
        gender: childData.gender,
        birthDate: childData.birthDate ? new Date(childData.birthDate) : null,
      },
    });

    // Gắn vào bảng Child kết nối với Union của bố mẹ
    await tx.child.create({
      data: {
        unionId: parentUnionId,
        personId: newChild.id,
        isAdopted: isAdopted,
      },
    });

    return newChild;
  });
}

// 2. Logic Thêm một Vợ/Chồng mới vào một Union
export async function addSpouseNode(
  spouseData: PersonData,
  spouseRole: string, // "Husband" or "Wife"
  existingPersonId: string
) {
  return await prisma.$transaction(async (tx) => {
    // Chèn thông tin cá nhân của người vợ/chồng
    const newSpouse = await tx.person.create({
      data: {
        fullName: spouseData.fullName,
        gender: spouseData.gender,
        birthDate: spouseData.birthDate ? new Date(spouseData.birthDate) : null,
      },
    });

    // Tạo một cuộc hôn nhân/liên kết (Union)
    const newUnion = await tx.union.create({
      data: {
        status: "Married",
        marriageDate: new Date() // Tạm để ngày hiện tại
      }
    });

    // Liên kết Vợ/Chồng này vào Union
    await tx.unionPerson.create({
      data: {
        unionId: newUnion.id,
        personId: newSpouse.id,
        role: spouseRole
      }
    });

    // Liên kết thành viên gia đình ban đầu vào Union này
    await tx.unionPerson.create({
      data: {
        unionId: newUnion.id,
        personId: existingPersonId,
        role: spouseRole === "Husband" ? "Wife" : "Husband" // Giả định đơn giản
      }
    });

    return newSpouse;
  });
}

// 3. Logic Lấy Cây Gia phả bằng Recursive CTE của PostgreSQL
export async function getDescendantsTree(ancestorId: string) {
  // Chú ý: Đây là raw sql dành riêng cho PostgreSQL. 
  // UUID trong Postgres cần type-cast (::uuid).
  const query = `
    WITH RECURSIVE descendant_tree AS (
      -- Base case: Tìm ông tổ
      SELECT 
        p.id, 
        p."fullName" as full_name, 
        p.gender, 
        0 AS generation,
        NULL::uuid AS parent_union_id,
        NULL::uuid AS child_union_id
      FROM "Person" p
      WHERE p.id = $1::uuid

      UNION ALL

      -- Recursive step: Tìm tất cả các con được sinh ra từ các Union của những người đang nằm trong descendant_tree
      SELECT 
        child_person.id, 
        child_person."fullName" as full_name, 
        child_person.gender,
        dt.generation + 1 AS generation,
        up."unionId" AS parent_union_id,
        c."unionId" AS child_union_id
      FROM descendant_tree dt
      JOIN "UnionPerson" up ON dt.id = up."personId"
      JOIN "Child" c ON up."unionId" = c."unionId"
      JOIN "Person" child_person ON c."personId" = child_person.id
    )
    SELECT * FROM descendant_tree ORDER BY generation ASC, full_name ASC;
  `;
  
  try {
    const descendants = await prisma.$queryRawUnsafe(query, ancestorId);
    return descendants;
  } catch (err) {
    console.error("Recursive CTE Failed:", err);
    return [];
  }
}
