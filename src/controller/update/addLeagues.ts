import { prisma } from '../../services/prisma'
import { allowed_leagues, generateLeagueOptions } from '../../services/default_list'
import { userCheck } from '../get/UserCheck'

export const addLeague = async (telegramId: string, name: string, sendMessage: (text: string) => Promise<void>) => {
  const isUserRegistered = await userCheck(telegramId, name);
  if (!isUserRegistered) return sendMessage('Se registre primeiro');

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
  return sendMessage(`A sua lista de ligas é ${user_leagues}`);
}
