import { getCommand, getCommandFullDescription, getCommandListText } from '../../commands/bot-command';
import { userCheck } from '../get/UserCheck'
import {createUser} from '../post/RegisterUser'

export const help = async (telegramId: string, name: string, sendMessage: (text: string) => Promise<void>): Promise<void> => {
  const isUserRegistered = await userCheck(telegramId);
  if (!isUserRegistered) return createUser(telegramId, name, sendMessage);

  return sendMessage(getCommandListText());
}
