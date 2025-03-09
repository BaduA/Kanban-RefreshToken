import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
async function main() {
  await prisma.user.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.duty.deleteMany();
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: await bcrypt.hash('12345', 10),
      role: 'ADMIN',
    },
  });
  const mod = await prisma.user.upsert({
    where: { username: 'mod' },
    update: {},
    create: {
      username: 'mod',
      password: await bcrypt.hash('12345', 10),
      role: 'MODERATOR',
    },
  });
  const user = await prisma.user.upsert({
    where: { username: 'user' },
    update: {},
    create: {
      username: 'user',
      password: await bcrypt.hash('12345', 10),
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
