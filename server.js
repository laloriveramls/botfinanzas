require("dotenv").config();

const app = require("./app");
const { startTelegramBot } = require("./bot"); // <— el bot en archivo aparte

const port = Number(process.env.PORT || 3000);

app.listen(port, "0.0.0.0", () => {
    console.log(`Listening on port ${port}`);
});

// Arranco el bot (polling)
startTelegramBot().catch((e) => console.error("Bot init failed:", e));
