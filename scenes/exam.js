'use strict';
const Scene = require('telegraf/scenes/base');
const axios = require('axios').default;
const handlers = require('./handlers');

const getExamQuestions = async () => {
  const examQuestionsRequest = await axios
    .get('http://127.0.0.1:3000/examquestions')
    .catch((err) => console.log(err));
  return examQuestionsRequest?.data || [];
};

const examTimedOut = async (ctx) => {
  if (ctx.session.__scenes.state?.answeredQuestionsCount < 20) {
    await ctx.reply('Час вийшов, іспит не складено');
    await ctx.scene.leave();
  }
};

const examScene = new Scene('exam');
examScene.enter(async (ctx) => {
  let questions = [];
  ctx.session.__scenes.state.answeredQuestionsCount = 0;
  ctx.session.__scenes.state.rightAnswersCount = 0;
  ctx.session.__scenes.state.wrongAnswersCount = 0;
  ctx.session.__scenes.state.startDate = new Date();

  questions = await getExamQuestions();

  const questionsArr = handlers.formatQuestions(questions);
  ctx.session.__scenes.state.questionsArr = questionsArr;
  ctx.session.__scenes.state.page = 1;

  await ctx.telegram.sendPhoto(
    ctx.chat.id,
    {
      url: questionsArr[0].image,
    },
    {
      caption: questionsArr[0].text,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [...questionsArr[0].answers],
          handlers.paginationKeyboard,
          [{ text: 'Вийти в меню', callback_data: 'quit' }],
        ],
      },
    },
  );
  setTimeout(await examTimedOut, 1200000, ctx);
});
examScene.action(
  ['0', '1'],
  async (ctx) => await handlers.answerCallback(ctx, true),
);
examScene.action(
  ['>', '<'],
  async (ctx) => await handlers.questionsPaginationCallback(ctx),
);
examScene.action('quit', async (ctx) => {
  await ctx.scene.leave();
  await ctx.deleteMessage();
  await ctx.reply('Ви успішно вийшли, відкрийте Меню та виберіть наступну дію');
});
examScene.on('message', (ctx) => {
  ctx.telegram.sendMessage(
    ctx.chat.id,
    'Ви не можете надсилати повідомлення або команди в даному розділі',
    {
      reply_markup: {
        inline_keyboard: [[{ text: 'Вийти', callback_data: 'quit' }]],
      },
    },
  );
});

module.exports = examScene;
