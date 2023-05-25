require('dotenv').config()
import TelegramBot from "node-telegram-bot-api"

import scrapingBestGames from "../../scraping-bets/src/index"
import { default_leagues } from "./services/default_list"

//Controllers
import { createUser } from "./controller/post/RegisterUser";
import { help } from "./controller/get/help";
import { addLeague } from './controller/update/addLeagues'
import { userCheck } from './controller/get/UserCheck'

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
    await sendMessage('Todos os usuários começam com o Brasileirão em suas ligas, caso queria adicionar outra liga use /help ')
})
  //scrapingBestGames(default_leagues, 'https://www.sofascore.com/')

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
    }
    return
});
