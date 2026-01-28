const { Telegraf } = require("telegraf");

async function startTelegramBot() {
    if (!process.env.BOT_TOKEN) {
        console.log("BOT_TOKEN not set, skipping bot start.");
        return;
    }

    const bot = new Telegraf(process.env.BOT_TOKEN);

    bot.start((ctx) => ctx.reply("Listo ✅ Mándame un gasto como: `uber 86`"));
    bot.on("text", (ctx) => ctx.reply(`Recibí: ${ctx.message.text}`));

    await bot.telegram.deleteWebhook({ drop_pending_updates: true });

    await bot.launch({
        dropPendingUpdates: true,
        allowedUpdates: ["message"],
    });

    console.log("Bot running (polling).");

    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

module.exports = { startTelegramBot };
