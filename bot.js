'use strict';

require('dotenv').config();
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

/*
To do:
1. Create database to store data (PostgreSQL + Sequalize) DONE
(instead of storing it in JSON files)
2. Refactor bot code to work with database instead of JSON files DONE
3. Make router to provide REST API for future products DONE
(maybe even deploy it to firebase)
4. Store user statistics about exams results
5. Feature to suggest your own questions
(admin gets them with callback buttons to accept it or decline)
6. Unit tests
8. Remove config and use .env file instead DONE
9. Make dirs for database code, bot scenes and so on DONE
*/

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.telegram.sendMessage(
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
  ctx.reply('Got document!');
});

bot.action('sections', (ctx) => ctx.scene.enter('sectionQuestions'));
bot.command('sections', (ctx) => ctx.scene.enter('sectionQuestions'));

bot.action('exam', (ctx) => ctx.scene.enter('exam'));
bot.command('exam', (ctx) => ctx.scene.enter('exam'));
