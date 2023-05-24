import { prisma } from '../../services/prisma'

export const userCheck = async (telegramId: any) => {
  const user = await prisma.user.findFirst({
    where: {
      telegramId
    }
  });

  await prisma.$disconnect
  return user ? true : false;
}
