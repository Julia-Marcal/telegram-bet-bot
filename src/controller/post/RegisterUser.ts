import { prisma } from '../../services/prisma'
import { default_leagues } from '../../services/default_list'
import { userCheck } from '../get/UserCheck'

export const createUser = async (telegramId: string, name: string, sendMessage: (text: string) => Promise<void>) => {
  const isUserRegistered = await userCheck(telegramId, name);
  if (isUserRegistered) return;

  const user = await prisma.user.create({
    data: {
      telegramId,
      name,
      leagues: default_leagues,
    }
  });

  return sendMessage(`${user.name} foi cadastrado no bet bot`);
}
