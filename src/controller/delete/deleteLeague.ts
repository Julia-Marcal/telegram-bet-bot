import { prisma } from '../../services/prisma'
import { userCheck } from '../get/UserCheck'
import { bot } from '../../index'
import { UserNotFoundException } from '../../error-handling/error-handling'

export const deleteLeague = async (telegramId: string, msg: any, sendMessage: (text: string) => Promise<void>) => {
  const isUserRegistered = await userCheck(telegramId);
  if (!isUserRegistered) return sendMessage('Se registre primeiro');

   const leagues = [
    { text: 'Premier League', callback_data: 'pm' },
    { text: 'LaLiga', callback_data: 'll' },
    { text: 'Serie A', callback_data: 'sa' },
    { text: 'Bundesliga', callback_data: 'bu' },
    { text: 'Ligue 1', callback_data: 'l1' },
    { text: 'Primeira Liga', callback_data: 'pl' },
    { text: 'Eredivisie', callback_data: 'er' },
    { text: 'UEFA Champions League', callback_data: 'chl' },
    { text: 'UEFA Europa League', callback_data: 'el' },
    { text: 'UEFA Europa Conference League', callback_data: 'col' },
  ];

  const opts = {
    reply_to_message_id: msg.message_id,
    reply_markup: {
      inline_keyboard: leagues.map((league) => [{ text: league.text, callback_data: league.callback_data }]),
    },
  };

  bot.sendMessage(msg.chat.id, 'Qual liga você quer excluir?', opts);
}

export const callbackDeleteLeague = async function onCallbackQuery(callbackQuery: any, telegramId: any) {
  const data = callbackQuery.data;
  const message = callbackQuery.message!;

  let removed_league: string;

  if (data === 'pm') {
  removed_league = 'Premier League';
  const possibleToExclude = await checkIfpossibleToExclude(message, removed_league, telegramId);
    if (possibleToExclude) {
      await Promise.all([
        await deleteLeagueFromList(removed_league, telegramId, message),
        await bot.sendMessage(message.chat.id, 'Premier League foi removida da sua lista'),
      ]);
    }

  } else if (data === 'll') {
    removed_league = 'LaLiga';
    const possibleToExclude = await checkIfpossibleToExclude(message, removed_league, telegramId);
    if(possibleToExclude){
      await Promise.all([
        await deleteLeagueFromList(removed_league, telegramId, message),
        await bot.sendMessage(message.chat.id, 'La Liga foi removida da sua lista'),
      ])
    }

  } else if (data === 'sa') {
    removed_league = 'Serie A';
    const possibleToExclude = await checkIfpossibleToExclude(message, removed_league, telegramId);
    if(possibleToExclude){
      await Promise.all([
        await deleteLeagueFromList(removed_league, telegramId, message),
        await bot.sendMessage(message.chat.id, 'Serie A foi removida da sua lista'),
      ])
    }

  } else if (data === 'bu') {
    removed_league = 'Bundesliga';
    const possibleToExclude = await checkIfpossibleToExclude(message, removed_league, telegramId);
    if(possibleToExclude){
      await Promise.all([
        await deleteLeagueFromList(removed_league, telegramId, message),
        await bot.sendMessage(message.chat.id, 'Bundesliga foi removida da sua lista'),
      ])
    }

  } else if (data === 'l1') {
    removed_league = 'Ligue 1';
    const possibleToExclude = await checkIfpossibleToExclude(message, removed_league, telegramId);
    if(possibleToExclude){
      await Promise.all([
        await deleteLeagueFromList(removed_league, telegramId, message),
        await bot.sendMessage(message.chat.id, 'Ligue 1 foi removida da sua lista'),
      ])
    }

  } else if (data === 'pl') {
    removed_league = 'Primeira Liga';
    const possibleToExclude = await checkIfpossibleToExclude(message, removed_league, telegramId);
    if(possibleToExclude){
      await Promise.all([
        await deleteLeagueFromList(removed_league, telegramId, message),
        await bot.sendMessage(message.chat.id, 'Primeira Liga foi removida da sua lista'),
      ])
    }

  } else if (data === 'er') {
    removed_league = 'Eredivisie';
    const possibleToExclude = await checkIfpossibleToExclude(message, removed_league, telegramId);
    if(possibleToExclude){
      await Promise.all([
        await deleteLeagueFromList(removed_league, telegramId, message),
        await bot.sendMessage(message.chat.id, 'Eredivisie foi removida da sua lista'),
      ])
    }

  } else if (data === 'ch1') {
    removed_league = 'UEFA Champions League';
    const possibleToExclude = await checkIfpossibleToExclude(message, removed_league, telegramId);
    if(possibleToExclude){
      await Promise.all([
        await deleteLeagueFromList(removed_league, telegramId, message),
        await bot.sendMessage(message.chat.id, 'UEFA Champions League foi removida da sua lista'),
      ])
    }

  } else if (data === 'el') {
    removed_league = 'UEFA Europa League';
    const possibleToExclude = await checkIfpossibleToExclude(message, removed_league, telegramId);
    if(possibleToExclude){
      await Promise.all([
        await deleteLeagueFromList(removed_league, telegramId, message),
        await bot.sendMessage(message.chat.id, 'UEFA Europa League League foi removida da sua lista'),
      ])
    }
  } else if (data === 'col') {
    removed_league = 'UEFA Europa Conference League';
    const possibleToExclude = await checkIfpossibleToExclude(message, removed_league, telegramId);
    if(possibleToExclude){
      await Promise.all([
        await deleteLeagueFromList(removed_league, telegramId, message),
        await bot.sendMessage(message.chat.id, 'UEFA Europa Conference League foi removida da sua lista'),
      ])
  }}
}


async function getUserLeagues(telegramId: any): Promise<String[]> {
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
    throw new UserNotFoundException('User not found')
  }
}

async function checkIfpossibleToExclude(message: any, removed_league: string, telegramId: any): Promise<boolean> {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const leagues = await getUserLeagues(telegramId);
      if (leagues.includes(removed_league)) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function deleteLeagueFromList(removedLeague: string, telegramId: any, message: any): Promise<void> {
  try {
    const leagues = await getUserLeagues(telegramId);
    const updatedLeagues = leagues.filter(word => word !== removedLeague).map(String);

    const updatedUser = await prisma.user.update({
      where: {
        telegramId
      },
      data: {
        leagues: updatedLeagues
      }
    });

    if (!updatedUser) {
      throw new UserNotFoundException('User not found');
    }

    const Userleagues = updatedUser.leagues;
    const leaguesString = Userleagues.join(', ');

    bot.sendMessage(message.chat.id, `Agora suas ligas são ${leaguesString}`);

    await prisma.$disconnect();
  } catch (error) {
    console.log(error);
  }
}


