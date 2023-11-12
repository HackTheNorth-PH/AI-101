import OpenAI from 'openai'
import { Telegraf } from 'telegraf'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

async function main() {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: 'gpt-3.5-turbo',
  })
}

main()
