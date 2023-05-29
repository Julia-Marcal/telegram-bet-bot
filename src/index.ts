require('dotenv').config()
import TelegramBot from "node-telegram-bot-api"

//Controllers
import { createUser } from "./controller/post/RegisterUser";
import { help } from "./controller/get/help";
import { addLeague, callback_league } from './controller/update/addLeagues'
import { userCheck } from './controller/get/UserCheck'
import { deleteLeague, callbackDeleteLeague } from './controller/delete/deleteLeague'
import { getLeagues } from './controller/get/getLeagues'
import { getGamesForUser } from './controller/get/GamesToday'


const token = process.env.TOKEN

if(!token) throw new Error('Missing Token')

export const bot = new TelegramBot(token, {polling: true})

//message sender function
const msgData = (msg: TelegramBot.Message) => {
  const [chatId, telegramId, text, name] = [msg.chat.id, msg.from?.id.toString(), msg.text, `${msg.from?.first_name}`];
  return {
    telegramId,
    text,
    name,
    async sendMessage(msgText: string): Promise<void>{
      await bot.sendMessage(chatId, msgText)
    }
  }
}

bot.onText(/.*/, async (msg) => {
  const { telegramId, name, sendMessage } = msgData(msg);
  const userAlreadyExists = userCheck(telegramId)

  if(await userAlreadyExists) return

  await sendMessage(`Bem vindo ao bet bot ${name}! Para saber mais envie o comando /help no chat`);
});


bot.onText(/\/start/, async (msg) => {
  const { telegramId, name, sendMessage } = msgData(msg);
    if (telegramId) {
        await createUser(telegramId, name, sendMessage);
    }
    await sendMessage('Todos os usuários começam com o Brasileirão em suas ligas, caso queria adicionar outra liga use /addLeague ')
})

bot.onText(/\/help/, async (msg) => {
    const { telegramId, name, sendMessage } = msgData(msg);
    if (telegramId) {
        await help(telegramId, name, sendMessage);
    }
});

bot.onText(/\/addLeague/, async (msg) => {
    const { telegramId, name, sendMessage } = msgData(msg);
    if (telegramId) {
        await addLeague(telegramId, name, msg, sendMessage);
        bot.on("callback_query", async (callbackQuery: any) => {
          await callback_league(callbackQuery, telegramId);
        })
    }
});

bot.onText(/\/deleteLeague/, async (msg) => {
    const { telegramId, sendMessage } = msgData(msg);
    if (telegramId) {
      await deleteLeague(telegramId, msg, sendMessage);
        bot.on("callback_query", async (callbackQuery: any) => {
          await callbackDeleteLeague(callbackQuery, telegramId)
        })
    }
})

bot.onText(/\/myLeagues/, async (msg) => {
    const { telegramId, sendMessage } = msgData(msg);
    if (telegramId) {
        await getLeagues(telegramId, sendMessage);
    }
});

bot.onText(/\/GamesToday/, async (msg) => {
  const { telegramId, name, sendMessage } = msgData(msg);
  if (telegramId){
    await getGamesForUser(telegramId, name, sendMessage)
  }
})
