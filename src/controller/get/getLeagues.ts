import { prisma } from '../../services/prisma'
import { userCheck } from '../get/UserCheck'

export const getLeagues = async (telegramId: string, sendMessage: (text: string) => Promise<void>) => {
  const isUserRegistered = await userCheck(telegramId);
  if (!isUserRegistered) return;

  const Userleagues = await prisma.user.findUnique({
    where:{
      telegramId
    },
    select:{
      leagues: true
    }
  })

  return sendMessage(`Essas são suas ligas atualmente ${Userleagues?.leagues}`);
}
