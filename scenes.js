const Scene = require("telegraf/scenes/base");
const Markup = require("telegraf/markup");

const sections = require("./sections.json");

const questionsHandler = require("./algorithm");

const numberEmojies = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];

const showMenu = (context) => {
  context.reply(
    "Ви в меню:",
    Markup.keyboard(["🔍 Питання до теми", "😎 Іспит"]).resize().extra()
  );
};

const answerCallback = async (ctx, isExam) => {
  let answer = ctx.update.callback_query.data == "1" ? true : false;
  let questionsArr = ctx.session.__scenes.state.questionsArr;
  let page = ctx.session.__scenes.state.page;
  questionsArr[page - 1].answered = true;
  if (answer) {
    ctx.session.__scenes.state.rightAnswersCount++;
    questionsArr[page - 1].text += "\n✅ Правильно";
  } else {
    ctx.session.__scenes.state.wrongAnswersCount++;
    let rightAnswerIndex =
      questionsArr[page - 1].answers.findIndex(
        (el) => el.callback_data == "1"
      ) + 1;
    questionsArr[
      page - 1
    ].text += `\n❌ Неправильно\nПравильна відповіть - №${rightAnswerIndex}`;
    if (isExam && ctx.session.__scenes.state.wrongAnswersCount > 2) {
      await ctx.deleteMessage();
      await ctx.reply(`Ви не склали екзамен.`);
      await ctx.scene.leave();
      return;
    }
  }
  await ctx.editMessageMedia(
    {
      type: "photo",
      media: questionsArr[page - 1].image,
    },
    {
      caption: questionsArr[page - 1].text,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "<", callback_data: "<" },
            { text: ">", callback_data: ">" },
          ],
          [{ text: "Вийти в меню", callback_data: "quit" }],
        ],
      },
    }
  );
  ctx.session.__scenes.state.answeredQuestionsCount++;
  if (
    ctx.session.__scenes.state.answeredQuestionsCount == questionsArr.length
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
            { text: "🔍 Питання до теми", callback_data: "sections" },
            { text: "😎 Іспит", callback_data: "exam" },
          ],
        ],
      },
    });
  } else {
    setTimeout(questionsPaginationCallback, 500, ctx, ">");
  }
};

const questionsPaginationCallback = async (ctx, action) => {
  let questionsArr = ctx.session.__scenes.state.questionsArr;
  let page = ctx.session.__scenes.state.page;
  let keyboard = [
    [
      { text: "<", callback_data: "<" },
      { text: ">", callback_data: ">" },
    ],
    [{ text: "Вийти в меню", callback_data: "quit" }],
  ];
  if (page < questionsArr.length && action == ">") {
    page++;
  } else if (page > 1 && action == "<") {
    page--;
  }
  if (page != ctx.session.__scenes.state.page) {
    let answered = questionsArr[page - 1].answered;
    if (!answered) keyboard.unshift([...questionsArr[page - 1].answers]);
    await ctx.editMessageMedia(
      {
        type: "photo",
        media: questionsArr[page - 1].image,
      },
      {
        caption: questionsArr[page - 1].text,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: keyboard,
        },
      }
    );
    ctx.session.__scenes.state.page = page;
  }
};

const sectionsPaginationCallback = async (ctx) => {
  let action = ctx.update.callback_query.data;
  let message = "Список тем:\n";
  let page = ctx.session.__scenes.state.page;
  let sectionsArr = ctx.session.__scenes.state.sectionsArr;
  let sectionNames = ctx.session.__scenes.state.sectionNames;
  if (page < Math.ceil(sections.length / 5) && action == ">>") {
    page++;
  } else if (page > 1 && action == "<<") {
    page--;
  }
  if (page != ctx.session.__scenes.state.page) {
    ctx.session.__scenes.state.page = page;

    let pageSections = sectionsArr.slice(page * 5 - 5, page * 5);
    message += sectionNames.slice(page * 5 - 5, page * 5).join("");

    await ctx.editMessageText(message, {
      reply_markup: {
        inline_keyboard: [
          [...pageSections],
          [
            { text: "<<", callback_data: "<<" },
            { text: ">>", callback_data: ">>" },
          ],
          [{ text: "Вийти в меню", callback_data: "quit" }],
        ],
      },
    });
  }
};

const examTimedOut = async (ctx) => {
  if (typeof ctx.session.__scenes == "undefined") {
    return;
  } else if (ctx.session.__scenes.state.answeredQuestionsCount < 20) {
    await ctx.reply("Час вийшов, екзамен не складено");
    await ctx.scene.leave();
  }
};

const sectionQuestionsScene = new Scene("sectionQuestions");
sectionQuestionsScene.enter(async (ctx) => {
  let message = "Список тем:\n";
  let page = 1;
  let sectionsArr = [];
  let pageSections = [];
  let sectionNames = [];

  for (let el of sections) {
    sectionNames.push(`🔍 ${el.name}\n`);
    let index = el.name.indexOf(". ");
    sectionsArr.push({
      text: el.name.slice(0, index),
      callback_data: el.id,
    });
  }
  ctx.session.__scenes.state.sectionsArr = sectionsArr;
  ctx.session.__scenes.state.sectionNames = sectionNames;

  ctx.session.__scenes.state.page = page;

  pageSections = sectionsArr.slice(page * 5 - 5, page * 5);
  message += sectionNames.slice(page * 5 - 5, page * 5).join("");

  ctx.telegram.sendMessage(ctx.chat.id, message, {
    reply_markup: {
      inline_keyboard: [
        [...pageSections],
        [
          { text: "<<", callback_data: "<<" },
          { text: ">>", callback_data: ">>" },
        ],
        [{ text: "Вийти в меню", callback_data: "quit" }],
      ],
    },
  });
});
sectionQuestionsScene.action(
  [">>", "<<"],
  async (ctx) => await sectionsPaginationCallback(ctx)
);
sectionQuestionsScene.action(/^\d+$/, async (ctx) => {
  await ctx.deleteMessage();
  await ctx.scene.enter("showSectionQuestions", {
    sectionId: ctx.update.callback_query.data,
  });
});
sectionQuestionsScene.action("quit", async (ctx) => {
  await ctx.scene.leave();
  await ctx.deleteMessage();
  await ctx.reply("Ви успішно вийшли, відкрийте Меню та виберіть наступну дію");
});
sectionQuestionsScene.on("message", (ctx) => {
  ctx.telegram.sendMessage(
    ctx.chat.id,
    "Ви не можете надсилати повідомлення або команди в даному розділі",
    {
      reply_markup: {
        inline_keyboard: [[{ text: "Вийти", callback_data: "quit" }]],
      },
    }
  );
});

const showSectionQuestionsScene = new Scene("showSectionQuestions");
showSectionQuestionsScene.enter(async (ctx) => {
  if (ctx.session.__scenes.state.sectionId) {
    let questions = [];
    let sectionId = ctx.session.__scenes.state.sectionId;
    ctx.session.__scenes.state.answeredQuestionsCount = 0;
    ctx.session.__scenes.state.rightAnswersCount = 0;
    ctx.session.__scenes.state.startDate = new Date();

    questions = questionsHandler.getSectionQuestions(sectionId);

    let questionsArr = formatQuestions(questions);
    ctx.session.__scenes.state.questionsArr = questionsArr;
    ctx.session.__scenes.state.page = 1;

    await ctx.telegram.sendPhoto(
      ctx.chat.id,
      {
        url: questionsArr[0].image,
      },
      {
        caption: questionsArr[0].text,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [...questionsArr[0].answers],
            [
              { text: "<", callback_data: "<" },
              { text: ">", callback_data: ">" },
            ],
            [{ text: "Вийти в меню", callback_data: "quit" }],
          ],
        },
      }
    );
  } else {
    await ctx.scene.leave("showSectionQuestions");
  }
});
showSectionQuestionsScene.action(
  ["0", "1"],
  async (ctx) => await answerCallback(ctx, false)
);
showSectionQuestionsScene.action(
  [">", "<"],
  async (ctx) =>
    await questionsPaginationCallback(ctx, ctx.update.callback_query.data)
);
showSectionQuestionsScene.action("quit", async (ctx) => {
  await ctx.scene.leave();
  await ctx.deleteMessage();
  await ctx.reply("Ви успішно вийшли, відкрийте Меню та виберіть наступну дію");
});
showSectionQuestionsScene.on("message", (ctx) => {
  ctx.telegram.sendMessage(
    ctx.chat.id,
    "Ви не можете надсилати повідомлення або команди в даному розділі",
    {
      reply_markup: {
        inline_keyboard: [[{ text: "Вийти", callback_data: "quit" }]],
      },
    }
  );
});

// EXAM SCENE

const examScene = new Scene("exam");
examScene.enter(async (ctx) => {
  let questions = [];
  ctx.session.__scenes.state.answeredQuestionsCount = 0;
  ctx.session.__scenes.state.rightAnswersCount = 0;
  ctx.session.__scenes.state.wrongAnswersCount = 0;
  ctx.session.__scenes.state.startDate = new Date();

  questions = questionsHandler.getExamQuestions();

  let questionsArr = formatQuestions(questions);
  ctx.session.__scenes.state.questionsArr = questionsArr;
  ctx.session.__scenes.state.page = 1;

  await ctx.telegram.sendPhoto(
    ctx.chat.id,
    {
      url: questionsArr[0].image,
    },
    {
      caption: questionsArr[0].text,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [...questionsArr[0].answers],
          [
            { text: "<", callback_data: "<" },
            { text: ">", callback_data: ">" },
          ],
          [{ text: "Вийти в меню", callback_data: "quit" }],
        ],
      },
    }
  );
  setTimeout(await examTimedOut, 1200000, ctx);
});
examScene.action(["0", "1"], async (ctx) => await answerCallback(ctx, true));
examScene.action(
  [">", "<"],
  async (ctx) =>
    await questionsPaginationCallback(ctx, ctx.update.callback_query.data)
);
examScene.action("quit", async (ctx) => {
  await ctx.scene.leave();
  await ctx.deleteMessage();
  await ctx.reply("Ви успішно вийшли, відкрийте Меню та виберіть наступну дію");
});
examScene.on("message", (ctx) => {
  ctx.telegram.sendMessage(
    ctx.chat.id,
    "Ви не можете надсилати повідомлення або команди в даному розділі",
    {
      reply_markup: {
        inline_keyboard: [[{ text: "Вийти", callback_data: "quit" }]],
      },
    }
  );
});

function formatQuestions(questionsArr) {
  let resultArr = [];
  let questionNumber = 1;
  for (let question of questionsArr) {
    let counter = 0;
    let questionObj = {
      text: `Питання №${questionNumber} з ${questionsArr.length}\n<b>${question.text}</b>\n\n`,
      image: "https://www.churchnb.org/wp-content/uploads/No.jpg",
      answers: [],
      answered: false,
    };
    questionNumber++;
    let answers = [];
    for (let answer of question.answers) {
      questionObj.text += `${numberEmojies[counter]} ${answer.text}\n`;
      answers.push({
        text: `${numberEmojies[counter]}`,
        callback_data: "0",
      });
      counter++;
    }
    answers[question.rightAnswerIndex].callback_data = "1";
    if (question.image) {
      questionObj.image = question.image;
    }
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
