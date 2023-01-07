'use strict';

const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const fastify = require('./router/server');

const scenes = require('./scenes');

const stage = new Stage([
  scenes.sectionQuestionsScene,
  scenes.showSectionQuestionsScene,
  scenes.examScene,
]);

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start(
  async (ctx) =>
    await ctx.telegram.sendMessage(
      ctx.chat.id,
      'Привіт, це бот для практики здачі теоретичного іспиту ПДР!',
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🔍 Питання до теми', callback_data: 'sections' },
              { text: '😎 Іспит', callback_data: 'exam' },
            ],
          ],
        },
      },
    ),
);
bot.use(session());
bot.use(stage.middleware());
bot.catch((err) => {
  console.log(err);
});

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err;
});

bot.launch();
bot.on('document', async (ctx) => {
  await ctx.reply('Got document!');
});

bot.action('sections', (ctx) => ctx.scene.enter('sectionQuestions'));
bot.command('sections', (ctx) => ctx.scene.enter('sectionQuestions'));

bot.action('exam', (ctx) => ctx.scene.enter('exam'));
bot.command('exam', (ctx) => ctx.scene.enter('exam'));
