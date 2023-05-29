import { getCommandListText } from '../../commands/bot-command';
import { userCheck } from './UserCheck'

export const help = async (telegramId: string, name: string, sendMessage: (text: string) => Promise<void>): Promise<void> => {
  const isUserRegistered = await userCheck(telegramId);
  if (!isUserRegistered) sendMessage(`${name} ainda não foi registrado, para usar os comandos corretamente se registre`);

  return sendMessage(getCommandListText());
}
