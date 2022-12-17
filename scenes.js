'use strict';
const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');
const axios = require('axios').default;

const getSections = async () => {
  const sectionsRequest = await axios
    .get('http://127.0.0.1:3000/sections')
    .catch((err) => {
      console.log(err);
    });
  return sectionsRequest?.data || [];
};

const getSectionQuestions = async (section) => {
  const questionsRequest = await axios
    .get('http://127.0.0.1:3000/sectionquestions/' + section.toString())
    .catch((err) => {
      console.log(err);
    });
  return questionsRequest?.data || [];
};

const getExamQuestions = async () => {
  const examQuestionsRequest = await axios
    .get('http://127.0.0.1:3000/examquestions')
    .catch((err) => {
      console.log(err);
    });
  return examQuestionsRequest?.data || [];
};

// (async () => {
//   const sections = await getSections();
//   const sectionQustions = await getSectionQuestions(2);
//   const examQuestions = await getExamQuestions();
//   console.log(JSON.stringify(examQuestions, 0, 2));
// })();

const numberEmojies = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];

const showMenu = (context) => {
  context.reply(
    'Ви в меню:',
    Markup.keyboard(['🔍 Питання до теми', '😎 Іспит']).resize().extra(),
  );
};

const questionsPaginationCallback = async (ctx, action) => {
  const questionsArr = ctx.session.__scenes.state.questionsArr;
  let page = ctx.session.__scenes.state.page;
  const keyboard = [
    [
      { text: '<', callback_data: '<' },
      { text: '>', callback_data: '>' },
    ],
    [{ text: 'Вийти в меню', callback_data: 'quit' }],
  ];
  if (page < questionsArr.length && action === '>') {
    page++;
  } else if (page > 1 && action === '<') {
    page--;
  }
  if (page !== ctx.session.__scenes.state.page) {
    const answered = questionsArr[page - 1].answered;
    if (!answered) keyboard.unshift([...questionsArr[page - 1].answers]);
    await ctx.editMessageMedia(
      {
        type: 'photo',
        media: questionsArr[page - 1].image,
      },
      {
        caption: questionsArr[page - 1].text,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: keyboard,
        },
      },
    );
    ctx.session.__scenes.state.page = page;
  }
};

const answerCallback = async (ctx, isExam) => {
  //REFACTOR (too long)
  const answer = ctx.update.callback_query.data === '1';
  const questionsArr = ctx.session.__scenes.state.questionsArr;
  const page = ctx.session.__scenes.state.page;
  questionsArr[page - 1].answered = true;
  if (answer) {
    ctx.session.__scenes.state.rightAnswersCount++;
    questionsArr[page - 1].text += '\n✅ Правильно';
  } else {
    ctx.session.__scenes.state.wrongAnswersCount++;
    const rightAnswerIndex =
      questionsArr[page - 1].answers.findIndex(
        (el) => el.callback_data === '1',
      ) + 1;
    questionsArr[
      page - 1
    ].text += `\n❌ Неправильно\nПравильна відповіть - №${rightAnswerIndex}`;
    if (isExam && ctx.session.__scenes.state.wrongAnswersCount > 2) {
      await ctx.deleteMessage();
      await ctx.reply('Ви не склали іспит.');
      await ctx.scene.leave();
      return;
    }
  }
  await ctx.editMessageMedia(
    {
      type: 'photo',
      media: questionsArr[page - 1].image,
    },
    {
      caption: questionsArr[page - 1].text,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '<', callback_data: '<' },
            { text: '>', callback_data: '>' },
          ],
          [{ text: 'Вийти в меню', callback_data: 'quit' }],
        ],
      },
    },
  );
  ctx.session.__scenes.state.answeredQuestionsCount++;
  if (
    ctx.session.__scenes.state.answeredQuestionsCount === questionsArr.length
  ) {
    const startDate = ctx.session.__scenes.state.startDate;
    const endDate = new Date();
    const completionTime = (endDate.getTime() - startDate.getTime()) / 1000;
    const message = `Запитання по темі пройдено
Правильно: ${ctx.session.__scenes.state.rightAnswersCount} з ${
      questionsArr.length
    }
Пройдено за ${parseInt(completionTime)} секунд`;
    ctx.telegram.sendMessage(ctx.chat.id, message, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🔍 Питання до теми', callback_data: 'sections' },
            { text: '😎 Іспит', callback_data: 'exam' },
          ],
        ],
      },
    });
  } else {
    setTimeout(questionsPaginationCallback, 500, ctx, '>');
  }
};

const sectionsPaginationCallback = async (ctx) => {
  const action = ctx.update.callback_query.data;
  let message = 'Список тем:\n';
  let page = ctx.session.__scenes.state.page;
  const sectionsArr = ctx.session.__scenes.state.sectionsArr;
  const sectionNames = ctx.session.__scenes.state.sectionNames;
  const sections = ctx.session.__scenes.state.sections;
  if (page < Math.ceil(sections.length / 5) && action === '>>') {
    page++;
  } else if (page > 1 && action === '<<') {
    page--;
  }
  if (page !== ctx.session.__scenes.state.page) {
    ctx.session.__scenes.state.page = page;
    // put page * 5 in variable
    const pageSections = sectionsArr.slice(page * 5 - 5, page * 5);
    message += sectionNames.slice(page * 5 - 5, page * 5).join('');

    await ctx.editMessageText(message, {
      reply_markup: {
        inline_keyboard: [
          [...pageSections],
          [
            { text: '<<', callback_data: '<<' },
            { text: '>>', callback_data: '>>' },
          ],
          [{ text: 'Вийти в меню', callback_data: 'quit' }],
        ],
      },
    });
  }
};

const examTimedOut = async (ctx) => {
  //REFACTOR IF STATEMENT
  if (typeof ctx.session.__scenes === 'undefined') {
    return;
  } else if (ctx.session.__scenes.state.answeredQuestionsCount < 20) {
    await ctx.reply('Час вийшов, іспит не складено');
    await ctx.scene.leave();
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
        [
          { text: '<<', callback_data: '<<' },
          { text: '>>', callback_data: '>>' },
        ],
        [{ text: 'Вийти в меню', callback_data: 'quit' }],
      ],
    },
  });
});
sectionQuestionsScene.action(
  ['>>', '<<'],
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

const showSectionQuestionsScene = new Scene('showSectionQuestions');
showSectionQuestionsScene.enter(async (ctx) => {
  if (ctx.session.__scenes.state.sectionId) {
    let questions = [];
    const sectionId = ctx.session.__scenes.state.sectionId;
    ctx.session.__scenes.state.answeredQuestionsCount = 0;
    ctx.session.__scenes.state.rightAnswersCount = 0;
    ctx.session.__scenes.state.startDate = new Date();

    questions = await getSectionQuestions(sectionId);

    const questionsArr = formatQuestions(questions);
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
            [
              { text: '<', callback_data: '<' },
              { text: '>', callback_data: '>' },
            ],
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
  async (ctx) => await answerCallback(ctx, false),
);
showSectionQuestionsScene.action(
  ['>', '<'],
  async (ctx) =>
    await questionsPaginationCallback(ctx, ctx.update.callback_query.data),
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

// EXAM SCENE

const examScene = new Scene('exam');
examScene.enter(async (ctx) => {
  let questions = [];
  ctx.session.__scenes.state.answeredQuestionsCount = 0;
  ctx.session.__scenes.state.rightAnswersCount = 0;
  ctx.session.__scenes.state.wrongAnswersCount = 0;
  ctx.session.__scenes.state.startDate = new Date();

  questions = await getExamQuestions();

  const questionsArr = formatQuestions(questions);
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
          [
            { text: '<', callback_data: '<' },
            { text: '>', callback_data: '>' },
          ],
          [{ text: 'Вийти в меню', callback_data: 'quit' }],
        ],
      },
    },
  );
  setTimeout(await examTimedOut, 1200000, ctx);
});
examScene.action(['0', '1'], async (ctx) => await answerCallback(ctx, true));
examScene.action(
  ['>', '<'],
  async (ctx) =>
    await questionsPaginationCallback(ctx, ctx.update.callback_query.data),
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

function formatQuestions(questionsArr) {
  const resultArr = [];
  let questionNumber = 1;
  for (const question of questionsArr) {
    let counter = 0;
    const questionObj = {
      text: `Питання №${questionNumber} з ${questionsArr.length}
<b>${question.text}</b>\n\n`,
      image:
        question.image || 'https://www.churchnb.org/wp-content/uploads/No.jpg',
      answers: [],
      answered: false,
    };
    questionNumber++;
    const answers = [];
    for (const answer of question.answers) {
      questionObj.text += `${numberEmojies[counter]} ${answer.text}\n`;
      answers.push({
        text: `${numberEmojies[counter]}`,
        callback_data: '0',
      });
      counter++;
    }
    answers[question.rightAnswerIndex].callback_data = '1';
    questionObj.answers = answers;
    resultArr.push(questionObj);
  }
  return resultArr;
}

module.exports = {
  sectionQuestionsScene,
  showSectionQuestionsScene,
  examScene,
  showMenu,
};
