require("dotenv").config();
const { Telegraf } = require("telegraf");

console.log("TOKEN OK?", !!process.env.BOT_TOKEN);

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.catch((err) => console.error("Telegraf error:", err));

bot.start((ctx) => ctx.reply("Listo ✅ Mándame un gasto como: `uber 86` o `gasto 120 tacos`"));
bot.on("text", (ctx) => ctx.reply(`Recibí: ${ctx.message.text}`));

(async () => {
    console.log("Step 1: getMe...");
    const me = await bot.telegram.getMe();
    console.log("getMe OK:", me.username);

    console.log("Step 2: deleteWebhook (safe)...");
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });

    console.log("Step 3: launching polling...");
    bot.launch({ dropPendingUpdates: true, allowedUpdates: ["message"] })
        .then(() => console.log("Bot corriendo (polling)."))
        .catch((e) => console.error("Launch failed:", e));

    // I keep the process alive and visible
    setInterval(() => console.log("alive", new Date().toLocaleTimeString()), 15000);
})();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
