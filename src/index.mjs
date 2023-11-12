import { Telegraf } from 'telegraf'
import OpenAI from 'openai'
import { message } from 'telegraf/filters'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

const CODE_PROMPT = `
Here are two input:output examples for code generation.
Please use these and follow the styling for future requests that you think are pertinent to the request.
Make sure all HTML is generated with the JSX flavoring.

// INPUT:
// A Blue Box with 3 yellow circles inside of it that have a red outline
// OUTPUT:
<div style={{
  backgroundColor: 'blue',
  padding: '20px',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  width: '300px',
  height: '100px',
}}>
  <div style={{
    backgroundColor: 'yellow',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: '2px solid red'
  }}></div>
  <div style={{
    backgroundColor: 'yellow',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    border: '2px solid red'
  }}></div>
</div>

// INPUT:
// A RED BUTTON THAT SAYS 'CLICK ME'
// OUTPUT:
<button style={{
  backgroundColor: 'red',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '50px',
  cursor: 'pointer'
}}>
  CLICK ME
</button>
`

const messages = [
  {
    role: 'system',
    content: 'You are a helpful assistant that answers questions.'
  },
  {
    role: 'system',
    content: CODE_PROMPT
  }
]

bot.command('start', async (ctx) => {
  await ctx.telegram.sendMessage(ctx.message.chat.id, "I'm a bot, please talk to me")
})

bot.command('code', async (ctx) => {
  messages.push({
    role: 'user',
    content: ctx.message.text,
  })

  const completion = await openai.chat.completions.create({
    messages,
    model: 'gpt-4'
  })
  const completionAnswer = completion.choices[0].message.content
  messages.push({
    role: 'assistant',
    content: completionAnswer
  })

  await ctx.telegram.sendMessage(ctx.message.chat.id, completionAnswer)
})

bot.command('image', async (ctx) => {
  const response = await openai.images.generate({
    prompt: ctx.message.text,
    n: 1,
    size: '1024x1024',
    model: 'dall-e-3'
  })

  const imageUrl = response.data[0].url

  await ctx.replyWithPhoto(imageUrl)
})

bot.on(message('text'), async (ctx) => {
  messages.push({
    role: 'user',
    content: ctx.message.text,
  })

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

  await ctx.telegram.sendMessage(ctx.message.chat.id, completionAnswer)
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
