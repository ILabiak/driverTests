'use strict';
const Scene = require('telegraf/scenes/base');
const axios = require('axios').default;
const handlers = require('./handlers');

const getSections = async () => {
  const sectionsRequest = await axios
    .get('http://127.0.0.1:3000/sections')
    .catch((err) => console.log(err));
  return sectionsRequest?.data || [];
};

const changePage = async (ctx, page) => {
  ctx.session.__scenes.state.page = page;
  const sectionsArr = ctx.session.__scenes.state.sectionsArr;
  const sectionNames = ctx.session.__scenes.state.sectionNames;

  const pageQuestionsNumber = 5;
  const pagination = page * pageQuestionsNumber;
  const pageSections = sectionsArr.slice(
    pagination - pageQuestionsNumber,
    pagination,
  );
  const message =
    'Список тем:\n' +
    sectionNames.slice(pagination - pageQuestionsNumber, pagination).join('');

  await ctx.editMessageText(message, {
    reply_markup: {
      inline_keyboard: [
        [...pageSections],
        handlers.paginationKeyboard,
        [{ text: 'Вийти в меню', callback_data: 'quit' }],
      ],
    },
  });
};

const sectionsPaginationCallback = async (ctx) => {
  const action = ctx.update.callback_query.data;
  let page = ctx.session.__scenes.state.page;

  const sections = ctx.session.__scenes.state.sections;
  if (page < Math.ceil(sections.length / 5) && action === '>') {
    page++;
  } else if (page > 1 && action === '<') {
    page--;
  }
  if (page !== ctx.session.__scenes.state.page) {
    await changePage(ctx, page);
  }
};

const sectionQuestionsScene = new Scene('sectionQuestions');
sectionQuestionsScene.enter(async (ctx) => {
  let message = 'Список тем:\n';
  const page = 1;
  const sectionsArr = [];
  let pageSections = [];
  const sectionNames = [];

  const sections = await getSections();

  for (const el of sections) {
    sectionNames.push(`🔍 ${el.name}\n`);
    const index = el.name.indexOf('. ');
    sectionsArr.push({
      text: el.name.slice(0, index),
      callback_data: el.id,
    });
  }
  ctx.session.__scenes.state.sections = sections;
  ctx.session.__scenes.state.sectionsArr = sectionsArr;
  ctx.session.__scenes.state.sectionNames = sectionNames;
  ctx.session.__scenes.state.page = page;

  pageSections = sectionsArr.slice(page * 5 - 5, page * 5);
  message += sectionNames.slice(page * 5 - 5, page * 5).join('');

  ctx.telegram.sendMessage(ctx.chat.id, message, {
    reply_markup: {
      inline_keyboard: [
        [...pageSections],
        handlers.paginationKeyboard,
        [{ text: 'Вийти в меню', callback_data: 'quit' }],
      ],
    },
  });
});
sectionQuestionsScene.action(
  ['>', '<'],
  async (ctx) => await sectionsPaginationCallback(ctx),
);
sectionQuestionsScene.action(/^\d+$/, async (ctx) => {
  await ctx.deleteMessage();
  await ctx.scene.enter('showSectionQuestions', {
    sectionId: ctx.update.callback_query.data,
  });
});
sectionQuestionsScene.action('quit', async (ctx) => {
  await ctx.scene.leave();
  await ctx.deleteMessage();
  await ctx.reply('Ви успішно вийшли, відкрийте Меню та виберіть наступну дію');
});
sectionQuestionsScene.on('message', (ctx) => {
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

module.exports = sectionQuestionsScene;
