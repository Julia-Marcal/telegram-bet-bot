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

      await prisma.$disconnect();

      return user_leagues?.leagues || [];
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  function checkIfLeagueAllowed(message: any, added_league: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      getUserLeagues()
        .then((leagues: string[]) => {
          if (leagues.includes(added_league)) {
            return bot.sendMessage(message.chat.id, `${added_league} is already in your list`);
          }
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async function updateLeagues(added_league: string) {
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

  async function stringLeagues(message: any, added_league: string) {
    const leagues = await getUserLeagues();
    const leaguesString = leagues.join(', ');

    bot.sendMessage(message.chat.id, `Agora suas ligas são ${leaguesString}, e agora foi adiconado ${added_league}`);
  }

  bot.on('callback_query', async function onCallbackQuery(callbackQuery) {

  const data = callbackQuery.data;
  const message = callbackQuery.message!;

  let added_league: string;

  if (data === 'pm') {
    added_league = 'Premier League';
    await checkIfLeagueAllowed(message, added_league);
    await bot.sendMessage(message.chat.id, 'Premier League was added to your list');
    await updateLeagues(added_league);
    stringLeagues(message, added_league);

  } else if (data === 'll') {
    added_league = 'LaLiga';
    await checkIfLeagueAllowed(message, added_league);
    await bot.sendMessage(message.chat.id, 'La Liga was added to your list');
    await updateLeagues(added_league);
    stringLeagues(message, added_league);

  } else if (data === 'sa') {
    added_league = 'Serie A';
    await checkIfLeagueAllowed(message, added_league);
    await bot.sendMessage(message.chat.id, 'Serie A was added to your list');
    await updateLeagues(added_league);
    stringLeagues(message, added_league);

  } else if (data === 'bu') {
    added_league = 'Bundesliga';
    await checkIfLeagueAllowed(message, added_league);
    await bot.sendMessage(message.chat.id, 'Bundesliga was added to your list');
    await updateLeagues(added_league);
    stringLeagues(message, added_league);

  } else if (data === 'l1') {
    added_league = 'Ligue 1';
    await bot.sendMessage(message.chat.id, 'Ligue 1 was added to your list');
    await updateLeagues(added_league);
    stringLeagues(message, added_league);

  } else if (data === 'pl') {
    added_league = 'Primeira Liga';
    await checkIfLeagueAllowed(message, added_league);
    await bot.sendMessage(message.chat.id, 'Primeira Liga was added to your list');
    await updateLeagues(added_league);
    stringLeagues(message, added_league);

  } else if (data === 'er') {
    added_league = 'Eredivisie';
    await checkIfLeagueAllowed(message, added_league);
    await bot.sendMessage(message.chat.id, 'Eredivisie was added to your list');
    await updateLeagues(added_league);
    stringLeagues(message, added_league);

  } else if (data === 'ch1') {
    added_league = 'UEFA Champions League';
    await checkIfLeagueAllowed(message, added_league);
    await bot.sendMessage(message.chat.id, 'UEFA Champions League was added to your list');
    await updateLeagues(added_league);
    stringLeagues(message, added_league);

  } else if (data === 'el') {
    added_league = 'UEFA Europa League';
    await checkIfLeagueAllowed(message, added_league)
    await bot.sendMessage(message.chat.id, 'UEFA Europa Conference League was added to your list');
    await updateLeagues(added_league);
    stringLeagues(message, added_league);
    }
  }
)}
