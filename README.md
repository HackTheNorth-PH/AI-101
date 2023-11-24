# ai-engineering-101

## Getting Started

### Telegram token

To use the [Telegram Bot API](https://core.telegram.org/bots/api), you first have to [get a bot account](https://core.telegram.org/bots) by [chatting with BotFather](https://core.telegram.org/bots#6-botfather).

BotFather will give you a token, something like `123456789:AbCdefGhIJKlmNoPQRsTUVwxyZ`.

### OpenAI API key

If you don't already have an OpenAI account, navigate to the [OpenAI website](https://www.openai.com/). After logging in, navigate to the [API keys](https://platform.openai.com/api-keys) page.

```bash
# Set your OpenAI and telegram API keys
cp .env.example .env

# Install dependencies
npm install

# Start the app
npm run start
```
