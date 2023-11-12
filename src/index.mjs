import { Telegraf } from 'telegraf'
import OpenAI from 'openai'
import { message } from 'telegraf/filters'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

const messages = [
  {
    role: 'system',
    content: 'You are a helpful assistant that answers questions.'
  }
]

bot.command('start', async (ctx) => {
  await ctx.reply("I'm a bot, please talk to me")
})

bot.on(message('text'), async (ctx) => {
  messages.push({
    role: 'user',
    content: ctx.message.text,
  })

  await ctx.sendChatAction('typing')

  const completion = await openai.chat.completions.create({
    messages,
    model: 'gpt-3.5-turbo',
    max_tokens: 1024
  })
  const completionAnswer = completion.choices[0].message.content
  messages.push({
    role: 'assistant',
    content: completionAnswer
  })

  await ctx.reply(completionAnswer)
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
