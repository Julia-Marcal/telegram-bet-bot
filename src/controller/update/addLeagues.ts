import { prisma } from '../../services/prisma'
import { allowed_leagues, generateLeagueOptions } from '../../services/default_list'
import { userCheck } from '../get/UserCheck'
import {bot} from '../../index'

export const addLeague = async (telegramId: string, name: string, msg: any, sendMessage: (text: string) => Promise<void>) => {
  const isUserRegistered = await userCheck(telegramId, name);
  if (!isUserRegistered) return sendMessage('Se registre primeiro');

  const opts = {
    reply_to_message_id: msg.message_id,
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Premier League', callback_data: 'pm' }],
        [{ text: 'LaLiga', callback_data: 'll' }],
        [{ text: 'Serie A', callback_data: 'sa' }],
        [{ text: 'Bundesliga', callback_data: 'bu' }],
        [{ text: 'Ligue 1', callback_data: 'l1' }],
        [{ text: 'Primeira Liga', callback_data: 'pl' }],
        [{ text: 'Eredivisie', callback_data: 'er' }],
        [{ text: 'UEFA Champions League', callback_data: 'chl' }],
        [{ text: 'UEFA Europa League', callback_data: 'el' }],
        [{ text: 'UEFA Europa Conference League', callback_data: 'col' }]
      ]
    }
  };

  const user = await prisma.user.update({
    where:{
      telegramId: telegramId
    },
    data: {
      leagues: allowed_leagues,
    }
  });

  const user_leagues = prisma.user.findUnique({
    where:{
      telegramId
    },
    select:{
      leagues: true
    }
  })

  await prisma.$disconnect
  bot.sendMessage(msg.chat.id, 'What league do you wanna add?', opts);
}
