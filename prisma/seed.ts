import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@giadinh.com'
  const adminPassword = 'AdminPassword123!' // Nên đổi ngay sau khi khởi tạo

  // 1. Kiểm tra xem Admin đã tồn tại chưa
  const existingAdmin = await prisma.userAccount.findUnique({
    where: { email: adminEmail }
  })

  if (existingAdmin) {
    console.log(`Tài khoản admin (${adminEmail}) đã tồn tại trong CSDL. Bỏ qua.`)
    return
  }

  console.log('Bắt đầu khởi tạo tài khoản Admin...')
  const passwordHash = await bcrypt.hash(adminPassword, 10)

  // 2. Tạo Admin
  await prisma.$transaction(async (tx) => {
    const adminAccount = await tx.userAccount.create({
      data: {
        email: adminEmail,
        passwordHash: passwordHash,
        role: 'Admin', // Quyền cao nhất
      }
    })

    await tx.person.create({
      data: {
        fullName: 'Quản trị viên Hệ thống',
        gender: 'Unknown',
        userAccountId: adminAccount.id
      }
    })
  })

  console.log('✅ Khởi tạo Admin thành công!')
  console.log(`Email: ${adminEmail}`)
  console.log(`Mật khẩu: ${adminPassword}`)
}

main()
  .catch((e) => {
    console.error('Lỗi khi chạy Seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
