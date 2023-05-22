import { prisma } from '../../services/prisma'
import { getCommand, getCommandFullDescription, getCommandListText } from '../../commands/bot-command';
import { allowed_leagues } from '../../services/default_list'
import { userCheck } from '../get/UserCheck'

export const createUser = async (telegramId: string, name: string, sendMessage: (text: string) => Promise<void>) => {
  const isUserRegistered = await userCheck(telegramId, name);
  if (isUserRegistered) return;

  const user = await prisma.user.create({
    data: {
      telegramId,
      name,
      leagues: allowed_leagues,
    }
  });

  return sendMessage(`Bem vindo ao bet bot\n${getCommandListText()}`);
}
