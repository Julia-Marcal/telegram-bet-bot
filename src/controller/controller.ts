import { prisma } from '../services/prisma'


export const createUser = async(telegramId: string, name: string) =>{
  const userCheck = await prisma.user.findFirst({
    where: {
      telegramId
    }
  });
  if(userCheck) return userCheck

  const user = await prisma.user.create({
    telegramId,
    name,
  })

  return user
}
