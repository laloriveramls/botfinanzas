require("dotenv").config();

const http = require("http");
const app = require("./app");

// I start a minimal HTTP server so the hosting platform keeps the app alive.
const PORT = Number(process.env.PORT || 3000);
app.set("port", PORT);

const server = http.createServer(app);
server.listen(PORT, "0.0.0.0", () => console.log(`HTTP listening on :${PORT}`));

// --- Telegram bot (polling) ---
const { Telegraf } = require("telegraf");

async function startTelegramBot() {
    if (!process.env.BOT_TOKEN) {
        console.log("BOT_TOKEN not set, skipping bot start.");
        return;
    }

    const bot = new Telegraf(process.env.BOT_TOKEN);

    bot.start((ctx) => ctx.reply("Listo ✅ Mándame un gasto como: `uber 86`"));
    bot.on("text", (ctx) => ctx.reply(`Recibí: ${ctx.message.text}`));

    // I force polling mode and drop old updates just in case.
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });

    bot.launch({ dropPendingUpdates: true, allowedUpdates: ["message"] })
        .then(() => console.log("Bot running (polling)."))
        .catch((e) => console.error("Bot launch failed:", e));

    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

startTelegramBot().catch((e) => console.error("Bot init failed:", e));
