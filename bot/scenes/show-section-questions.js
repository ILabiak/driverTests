'use strict';
const Scene = require('telegraf/scenes/base');
const axios = require('axios').default;
const handlers = require('./handlers');

const getSectionQuestions = async (section) => {
  const questionsRequest = await axios
    .get('http://127.0.0.1:3000/sectionquestions/' + section.toString())
    .catch((err) => console.log(err));
  return questionsRequest?.data || [];
};

const showSectionQuestionsScene = new Scene('showSectionQuestions');
showSectionQuestionsScene.enter(async (ctx) => {
  if (ctx.session.__scenes.state.sectionId) {
    let questions = [];
    const sectionId = ctx.session.__scenes.state.sectionId;
    ctx.session.__scenes.state.answeredQuestionsCount = 0;
    ctx.session.__scenes.state.rightAnswersCount = 0;
    ctx.session.__scenes.state.startDate = new Date();

    questions = await getSectionQuestions(sectionId);

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
  } else {
    await ctx.scene.leave('showSectionQuestions');
  }
});
showSectionQuestionsScene.action(
  ['0', '1'],
  async (ctx) => await handlers.answerCallback(ctx, false),
);
showSectionQuestionsScene.action(
  ['>', '<'],
  async (ctx) => await handlers.questionsPaginationCallback(ctx),
);
showSectionQuestionsScene.action('quit', async (ctx) => {
  await ctx.scene.leave();
  await ctx.deleteMessage();
  await ctx.reply('Ви успішно вийшли, відкрийте Меню та виберіть наступну дію');
});
showSectionQuestionsScene.on('message', (ctx) => {
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

module.exports = showSectionQuestionsScene;
