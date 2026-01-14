import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin credentials
  const adminEmail = 'admin@kopicerita.com';
  const adminPassword = 'admin123';
  const adminName = 'Admin Kopi Cerita';

  // Hash password
  const hashedPassword = await hash(adminPassword, 12);

  // Cek apakah admin sudah ada
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    // Update role ke admin
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: 'admin' },
    });
    console.log('✅ Admin user sudah ada, role diupdate ke admin');
  } else {
    // Buat admin baru
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: 'admin',
      },
    });
    console.log('✅ Admin user berhasil dibuat!');
  }

  console.log('\n📧 Email: admin@kopicerita.com');
  console.log('🔑 Password: admin123');
  console.log('\nSilakan login di /login lalu akses /admin');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
