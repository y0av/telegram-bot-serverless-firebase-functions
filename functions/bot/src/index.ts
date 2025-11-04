
import {defineSecret} from "firebase-functions/params";
import {onRequest} from "firebase-functions/v2/https";
import {TelegramBot} from "typescript-telegram-bot-api";

const botTokenSecret = defineSecret("BOT_TOKEN_SECRET");
const webhookSecret = defineSecret("WEBHOOK_64_CHAR_TOKEN");

export const botfunction = onRequest({secrets: [botTokenSecret, webhookSecret]},
    async (request, response) => {
      const expectedSecret = webhookSecret.value();
      const receivedSecret = request.get("X-Telegram-Bot-Api-Secret-Token");

      // Verify Telegram webhook secret before processing the inbound update.
      if (!receivedSecret || receivedSecret !== expectedSecret) {
        console.warn("Rejected request: invalid or missing Telegram secret token");
        response.status(403).send("Forbidden");
        return;
      }

      try {
        const bot = new TelegramBot({botToken: botTokenSecret.value()});
        const {body} = request;

        if (body.message) {
          const {chat: {id}, text} = body.message;

          if (text && text === "/test") {
            await bot.sendMessage({chat_id: id, text: "Test message"});
          } else if (text && text === "/time") {
            const now = new Date();
            const timeString = now.toLocaleString();
            await bot.sendMessage({
              chat_id: id,
              text: "Current time: " + timeString,
            });
          } else if (text) {
            const message = "⚠️ Sorry, \"" + text + "\" is not a" +
                    " recognized command.";
            await bot.sendMessage({
              chat_id: id,
              text: message});
          }
        }
      } catch (error: unknown) {
        console.error("Error sending message");
        console.log(error instanceof Error ? error.toString() : String(error));
      }
      response.send("OK");
    });
