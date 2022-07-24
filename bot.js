"use strict";

const config = require("./config/config.json")
const Telegraf = require("telegraf");
const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const Scene = require("telegraf/scenes/base");
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");
const { enter, leave } = Stage;
// const fetch = require("node-fetch");
// const fs = require("fs");

const bot = new Telegraf(config.bot_token);
bot.start((ctx) => ctx.reply("Привіт, це бот для практики здачі теоретичного іспиту ПДР!"));
bot.use(session());
//bot.use(stage.middleware());
bot.catch((err) => {
  console.log(err)
})
bot.launch();
bot.on("document", async (ctx) => {

});


bot.on("sticker", async (ctx) => {

  let messageId = ctx.update.message.message_id;
  ctx.reply("response", Extra.inReplyTo(messageId));
});