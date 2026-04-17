import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString, ssl: true })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

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
