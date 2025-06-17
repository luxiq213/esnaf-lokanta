import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('1234', 10);
  await prisma.user.create({
    data: {
      name: 'mehmet cömert',
      email: 'admin@admin.com',
      password,
      address: 'Örnek Mah. 123. Sokak No:1',
      phone: '5551112233',
      role: 'admin',
      isApproved: true,
    },
  });
  console.log('Admin kullanıcı eklendi!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 