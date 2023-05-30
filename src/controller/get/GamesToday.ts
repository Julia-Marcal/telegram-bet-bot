import { prisma } from '../../services/prisma';
import { userCheck } from './UserCheck';
import scrapingBestGames from '../../../ScrapingScripts/scrap';

import { UserNotFoundException } from '../../error-handling/Error-handling';
import { stringify } from 'querystring';

interface GameInfo {
  game: string;
  FirstTeam: string;
  Tie: string;
  SecondTeam: string;
}

export const getGamesForUser = async (telegramId: string, name: string, sendMessage: (text: string) => Promise<void>): Promise<void> => {
  const isUserRegistered = await userCheck(telegramId);
  if (!isUserRegistered) {
    sendMessage('Usuário não foi cadastrado');
    throw new UserNotFoundException('User not found');
  }

  sendMessage(`Olá ${name}, achar os jogos de hoje pode demorar um pouco. Por favor, tenha paciência.`);

  const UserLeaguesList = await prisma.user.findUnique({
    where: {
      telegramId,
    },
    select: {
      leagues: true,
    },
  });

  if (!UserLeaguesList || !UserLeaguesList.leagues) {
    return sendMessage('Não foi possível obter a lista de ligas do usuário.');
  }

  const gamesToday: any = await scrapingBestGames(UserLeaguesList.leagues, 'https://www.sofascore.com');

  if (gamesToday.length == 0) {
    return sendMessage('Não há jogos das suas ligas hoje.');
  }

  const gamesText = gamesToday.map((game: any) => `·${game.game}. Odd 1° Time: ${game.FirstTeam}, Odd de Empate: ${game.Tie},  Odd 2° Time: ${game.SecondTeam}\n`);
  return sendMessage(`Os jogos de hoje são:\n${gamesText}`);
};
