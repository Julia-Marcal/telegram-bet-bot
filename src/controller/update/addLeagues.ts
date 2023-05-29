import { prisma } from '../../services/prisma'
import { userCheck } from '../get/UserCheck'
import { bot } from '../../index'

import { UserNotFoundException } from '../../error-handling/Error-handling'

export const addLeague = async (telegramId: string, name: string, msg: any, sendMessage: (text: string) => Promise<void>): Promise<void> => {
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

  bot.sendMessage(msg.chat.id, 'Qual liga quer adicionar', opts);
}

async function getUserLeagues(telegramId: any): Promise<string[]> {
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
    throw new UserNotFoundException('User not found');
    return [];
  }
}

async function checkIfLeagueAllowed(message: any, added_league: string, telegramId: any): Promise<boolean> {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const leagues = await getUserLeagues(telegramId);
      if (leagues.includes(added_league)) {
        await bot.sendMessage(message.chat.id, `${added_league} is already in your list`);
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function updateLeagues(added_league: string, telegramId: any): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        telegramId: telegramId,
      },
    });

    if (!user) {
      throw new UserNotFoundException('User not found');
    }

    await prisma.user.update({
      where: {
        telegramId: telegramId,
      },
      data: {
        leagues: {
          push: added_league,
        },
      },
    });

  } catch (error) {
    console.log(error);
  }
}

async function stringLeagues(message: any, telegramId: any): Promise<void>{
  const leagues = await getUserLeagues(telegramId);
  const leaguesString = leagues.join(', ');

  bot.sendMessage(message.chat.id, `Agora suas ligas são ${leaguesString}`);
}

export const callback_league = async function onCallbackQuery(callbackQuery: any, telegramId: any): Promise<void>{
  const data = callbackQuery.data;
  const message = callbackQuery.message!;

  let added_league: string;

  if (data === 'pm') {
  added_league = 'Premier League';
  const leagueAllowed = await checkIfLeagueAllowed(message, added_league, telegramId);
    if (!leagueAllowed) {
      await Promise.all([
        await bot.sendMessage(message.chat.id, 'Premier League foi adicionada a sua lista'),
        await updateLeagues(added_league, telegramId),
        await stringLeagues(message, telegramId)
      ]);
    }

  } else if (data === 'll') {
    added_league = 'LaLiga';
    const leagueAllowed = await checkIfLeagueAllowed(message, added_league, telegramId);
    if(!leagueAllowed){
      await Promise.all([
        await bot.sendMessage(message.chat.id, 'La Liga foi adicionada a sua lista'),
        await updateLeagues(added_league, telegramId),
        await stringLeagues(message, telegramId)
      ])
    }

  } else if (data === 'sa') {
    added_league = 'Serie A';
    const leagueAllowed = await checkIfLeagueAllowed(message, added_league, telegramId);
    if(!leagueAllowed){
      await Promise.all([
        await bot.sendMessage(message.chat.id, 'Serie A foi adicionada a sua lista'),
        await updateLeagues(added_league, telegramId),
        await stringLeagues(message, telegramId)
      ])
    }

  } else if (data === 'bu') {
    added_league = 'Bundesliga';
    const leagueAllowed = await checkIfLeagueAllowed(message, added_league, telegramId);
    if(!leagueAllowed){
      await Promise.all([
        await bot.sendMessage(message.chat.id, 'Bundesliga foi adicionada a sua lista'),
        await updateLeagues(added_league, telegramId),
        await stringLeagues(message, telegramId),
      ])
    }

  } else if (data === 'l1') {
    added_league = 'Ligue 1';
    const leagueAllowed = await checkIfLeagueAllowed(message, added_league, telegramId);
    if(!leagueAllowed){
      await Promise.all([
        await bot.sendMessage(message.chat.id, 'Ligue 1 foi adicionada a sua lista'),
        await updateLeagues(added_league, telegramId),
        await stringLeagues(message, telegramId),
      ])
    }

  } else if (data === 'pl') {
    added_league = 'Primeira Liga';
    const leagueAllowed = await checkIfLeagueAllowed(message, added_league, telegramId);
    if(!leagueAllowed){
      await Promise.all([
        await bot.sendMessage(message.chat.id, 'Primeira Liga foi adicionada a sua lista'),
        await updateLeagues(added_league, telegramId),
        await stringLeagues(message, telegramId),
      ])
    }

  } else if (data === 'er') {
    added_league = 'Eredivisie';
    const leagueAllowed = await checkIfLeagueAllowed(message, added_league, telegramId);
    if(!leagueAllowed){
      await Promise.all([
        await bot.sendMessage(message.chat.id, 'Eredivisie foi adicionada a sua lista'),
        await updateLeagues(added_league, telegramId),
        await stringLeagues(message, telegramId),
      ])
    }

  } else if (data === 'ch1') {
    added_league = 'UEFA Champions League';
    const leagueAllowed = await checkIfLeagueAllowed(message, added_league, telegramId);
    if(!leagueAllowed){
      await Promise.all([
        await bot.sendMessage(message.chat.id, 'UEFA Champions League foi adicionada a sua lista'),
        await updateLeagues(added_league, telegramId),
        await stringLeagues(message, telegramId),
      ])
    }

  } else if (data === 'el') {
    added_league = 'UEFA Europa League';
    const leagueAllowed = await checkIfLeagueAllowed(message, added_league, telegramId);
    if(!leagueAllowed){
      await Promise.all([
        await bot.sendMessage(message.chat.id, 'UEFA Europa League League foi adicionada a sua lista'),
        await updateLeagues(added_league, telegramId),
        await stringLeagues(message, telegramId),
      ])
    }
  } else if (data === 'col') {
    added_league = 'UEFA Europa Conference League';
    const leagueAllowed = await checkIfLeagueAllowed(message, added_league, telegramId);
    if(!leagueAllowed){
      await Promise.all([
        await bot.sendMessage(message.chat.id, 'UEFA Europa Conference League foi adicionada a sua lista'),
        await updateLeagues(added_league, telegramId),
        await stringLeagues(message, telegramId),
      ])
  }}
}
