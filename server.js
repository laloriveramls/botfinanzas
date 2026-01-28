require('dotenv').config();
const express = require('express');
const { Telegraf } = require('telegraf');

if (!process.env.BOT_TOKEN) throw new Error('Missing BOT_TOKEN');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Bot basics
bot.start((ctx) => ctx.reply('Listo ✅ Mándame: "gasto 120 tacos"'));
bot.launch();

// Minimal web server (keeps hosting happy)
const app = express();
app.get('/health', (_req, res) => res.status(200).send('ok'));

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, '0.0.0.0', () => console.log(`HTTP alive on :${PORT}`));

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
