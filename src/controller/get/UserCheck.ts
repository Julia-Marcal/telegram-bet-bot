import { prisma } from '../../services/prisma'

export const userCheck = async (telegramId: string, name: string) => {
  const user = await prisma.user.findFirst({
    where: {
      telegramId
    }
  });

  return user ? true : false;
}
