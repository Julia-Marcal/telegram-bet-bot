import TelegramBot from "node-telegram-bot-api"

require('dotenv').config()
const token = process.env.TOKEN

if(!token) throw new Error('Missing Token')

const bot = new TelegramBot(token, {polling: true})

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
