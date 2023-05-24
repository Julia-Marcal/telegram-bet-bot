import { prisma } from '../../services/prisma'
import { userCheck } from '../get/UserCheck'
import { bot } from '../../index'

export const addLeague = async (telegramId: string, name: string, msg: any, sendMessage: (text: string) => Promise<void>) => {
  const isUserRegistered = await userCheck(telegramId);
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


  bot.sendMessage(msg.chat.id, 'What league do you wanna add?', opts);

  bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  const data = callbackQuery.data;
  const message = callbackQuery.message!;

  let added_league: string;

  if (data === 'pm') {
    bot.sendMessage(message.chat.id, 'Premier League was added to your list');
    added_league = 'Premier League';
  } else if (data === 'll') {
    bot.sendMessage(message.chat.id, 'La Liga was added to your list');
    added_league = 'LaLiga';
  } else if (data == 'sa'){
    bot.sendMessage(message.chat.id, 'Serie A was added to your list');
    added_league = 'Serie A';
  } else if (data == 'bu'){
    bot.sendMessage(message.chat.id, 'Bundesliga was added to your list');
    added_league = 'Bundesliga';
  } else if (data == 'l1'){
    bot.sendMessage(message.chat.id, 'Ligue 1 was added to your list');
    added_league = 'Ligue 1';
  } else if (data == 'pl'){
    bot.sendMessage(message.chat.id, 'Primeira Liga was added to your list');
    added_league = 'Primeira Liga'
  } else if (data == 'er'){
    bot.sendMessage(message.chat.id, 'Eredivisie was added to your list');
    added_league = 'Eredivisie'
  } else if (data == 'ch1'){
    bot.sendMessage(message.chat.id, 'UEFA Champions League was added to your list');
    added_league = 'UEFA Champions League'
  } else if (data == 'el'){
    bot.sendMessage(message.chat.id, 'UEFA Europa League was added to your list');
    added_league = 'UEFA Europa League'
  } else if (data == 'col'){
    bot.sendMessage(message.chat.id, 'UEFA Europa Conference League was added to your list');
    added_league = 'UEFA Europa Conference League'
  }

  async function updateLeagues() {
    try {
      const user = await prisma.user.update({
        where: {
          telegramId: telegramId
        },
        data: {
          leagues: {
            push: added_league
          },
        }
      });

    } catch (error) {
      console.log(error)
    }
  }


  async function getUserLeagues() {
    try {
      const user_leagues = await prisma.user.findUnique({
        where: {
          telegramId
        },
        select: {
          leagues: true
        }
      });

      const leagues = user_leagues!.leagues;

      const leaguesString = leagues.join(', ');

      bot.sendMessage(message.chat.id, `Suas ligas são ${leaguesString}`);

      await prisma.$disconnect();
    } catch (error) {
      console.log(error)
    }
  }

  updateLeagues();
  getUserLeagues();

});
}
