"use strict";

const config = require("./config/config.json");
const Telegraf = require("telegraf");
const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");
// const fetch = require("node-fetch");
// const fs = require("fs");

const scenes = require("./scenes");

const stage = new Stage(
  [
    scenes.sectionQuestionsScene,
    scenes.showSectionQuestionsScene,
    scenes.examScene,
  ]
  // ,
  // { ttl: 10 }
);

const bot = new Telegraf(config.bot_token);
bot.start((ctx) =>
  ctx.telegram.sendMessage(
    ctx.chat.id,
    "Привіт, це бот для практики здачі теоретичного іспиту ПДР!",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🔍 Питання до теми", callback_data: "sections" },
            { text: "😎 Іспит", callback_data: "exam" },
          ],
        ],
      },
    }
  )
);
bot.use(session());
bot.use(stage.middleware());
bot.catch((err) => {
  console.log(err);
});
bot.launch();
bot.on("document", async (ctx) => {});

bot.action("sections", (ctx) => ctx.scene.enter("sectionQuestions"));
bot.action("exam", (ctx) => ctx.scene.enter("exam"));
bot.command("sections", (ctx) => ctx.scene.enter("sectionQuestions"));
bot.command("exam", (ctx) => ctx.scene.enter("exam"));

bot.command("photo", async (ctx) => {
  ctx.replyWithPhoto(
    {
      type: photo,
      url: "https://green-way.com.ua/storage/app/uploads/public/61d/c2c/60d/61dc2c60dbb16873548078.jpg",
    },
    { caption: "<b>Test</b>", parse_mode: "HTML" }
  );
});

bot.on("sticker", async (ctx) => {
  let messageId = ctx.update.message.message_id;
  ctx.reply("response", Extra.inReplyTo(messageId));
});
