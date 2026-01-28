require("dotenv").config();
const express = require("express");
const { Telegraf } = require("telegraf");

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

// I expose a small HTTP server so Hostinger can detect and keep the app healthy.
app.get("/", (req, res) => res.status(200).send("OK"));
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

bot.start((ctx) => ctx.reply("Listo ✅ Mándame un gasto como: `uber 86`"));

bot.on("text", (ctx) => ctx.reply(`Recibí: ${ctx.message.text}`));

(async () => {
    // I make sure polling works even if a webhook was set in the past.
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });

    bot.launch({ dropPendingUpdates: true, allowedUpdates: ["message"] })
        .then(() => console.log("Bot corriendo (polling)."))
        .catch((e) => console.error("Launch failed:", e));
})();

const PORT = process.env.PORT || 3000;
// I listen on the port provided by the platform.
app.listen(PORT, "0.0.0.0", () => console.log(`HTTP listening on :${PORT}`));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
