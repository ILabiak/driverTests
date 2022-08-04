const Stage = require("telegraf/stage");
const Scene = require("telegraf/scenes/base");
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");

const questions = require("./questions.json");
const sections = require("./sections.json");

const test = require("./algorithm");

const numberEmojies = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];

const showMenu = (context) => {
  context.reply(
    "Ви в меню:",
    Markup.keyboard(["Моя інформація"]).resize().extra()
  );
};

const answerCallback = async (ctx) => {
  let answer = ctx.update.callback_query.data == "1" ? true : false;
  let questionsArr = ctx.session.__scenes.state.questionsArr;
  let page = ctx.session.__scenes.state.page;
  questionsArr[page - 1].answered = true;

  if (answer) {
    ctx.session.__scenes.state.rightAnswersCount++;
    questionsArr[page - 1].text += "\n✅ Правильно";
  } else {
    let rightAnswerIndex = questionsArr[page - 1].answers.findIndex(el => el.callback_data == "1") + 1
    questionsArr[
      page - 1
    ].text += `\n❌ Неправильно\nПравильна відповіть - №${rightAnswerIndex}`;
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
          // [{ text: "Меню", callback_data: "menu" }],
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
    ctx.reply(message);
  }
};

const sectionQuestionsScene = new Scene("sectionQuestions");
sectionQuestionsScene.enter(async (ctx) => {
  let message = "Список тем:\n";
  let page;
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

  page = 1;
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
      ],
    },
  });
});
sectionQuestionsScene.action(">>", (ctx) => {
  let message = "Список тем:\n";
  let page = ctx.session.__scenes.state.page;
  let sectionsArr = ctx.session.__scenes.state.sectionsArr;
  let sectionNames = ctx.session.__scenes.state.sectionNames;
  if (page < Math.ceil(sections.length / 5)) {
    page++;
    ctx.session.__scenes.state.page = page;

    let pageSections = sectionsArr.slice(page * 5 - 5, page * 5);
    message += sectionNames.slice(page * 5 - 5, page * 5).join("");

    ctx.editMessageText(message, {
      reply_markup: {
        inline_keyboard: [
          [...pageSections],
          [
            { text: "<<", callback_data: "<<" },
            { text: ">>", callback_data: ">>" },
          ],
        ],
      },
    });
  }
});
sectionQuestionsScene.action("<<", (ctx) => {
  let message = "Список тем:\n";
  let page = ctx.session.__scenes.state.page;
  let sectionsArr = ctx.session.__scenes.state.sectionsArr;
  let sectionNames = ctx.session.__scenes.state.sectionNames;
  if (page > 1) {
    page--;
    ctx.session.__scenes.state.page = page;

    let pageSections = sectionsArr.slice(page * 5 - 5, page * 5);
    message += sectionNames.slice(page * 5 - 5, page * 5).join("");

    ctx.editMessageText(message, {
      reply_markup: {
        inline_keyboard: [
          [...pageSections],
          [
            { text: "<<", callback_data: "<<" },
            { text: ">>", callback_data: ">>" },
          ],
        ],
      },
    });
  }
});
sectionQuestionsScene.action(/^\d+$/, async (ctx) => {
  ctx.scene.enter("showSectionQuestions", {
    sectionId: ctx.update.callback_query.data,
  });
});
sectionQuestionsScene.hears("Меню", (ctx) => {
  showMenu(ctx);
  ctx.scene.leave("sectionQuestions");
});
sectionQuestionsScene.on("message", (ctx) => {
  ctx.reply("Don't know what u mean");
});

const showSectionQuestionsScene = new Scene("showSectionQuestions");
showSectionQuestionsScene.enter(async (ctx) => {
  if (ctx.session.__scenes.state.sectionId) {
    let questions = [];
    let sectionId = ctx.session.__scenes.state.sectionId;
    ctx.session.__scenes.state.answeredQuestionsCount = 0;
    ctx.session.__scenes.state.rightAnswersCount = 0;
    ctx.session.__scenes.state.startDate = new Date();

    questions = test.getSectionQuestions(sectionId);

    let questionsArr = formatQuestions(questions);
    ctx.session.__scenes.state.questionsArr = questionsArr;
    ctx.session.__scenes.state.page = 1;

    ctx.telegram.sendPhoto(
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
            // [{ text: "Меню", callback_data: "menu" }],
          ],
        },
      }
    );
  } else {
    ctx.scene.leave("showSectionQuestions");
  }
});
showSectionQuestionsScene.action("1", async (ctx) => await answerCallback(ctx));
showSectionQuestionsScene.action("0", async (ctx) => await answerCallback(ctx));
showSectionQuestionsScene.action(">", async (ctx) => {
  let questionsArr = ctx.session.__scenes.state.questionsArr;
  let page = ctx.session.__scenes.state.page;
  if (page < questionsArr.length) {
    page++;
    let answered = questionsArr[page - 1].answered
    let keyboard = [
      [
        { text: "<", callback_data: "<" },
        { text: ">", callback_data: ">" },
      ],
      // [{ text: "Меню", callback_data: "menu" }],
    ]
    if(!answered) keyboard.unshift([...questionsArr[page - 1].answers])
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
});
showSectionQuestionsScene.action("<", async (ctx) => {
  let questionsArr = ctx.session.__scenes.state.questionsArr;
  let page = ctx.session.__scenes.state.page;
  if (page > 1) {
    page--;
    let answered = questionsArr[page - 1].answered
    let keyboard = [
      [
        { text: "<", callback_data: "<" },
        { text: ">", callback_data: ">" },
      ],
      // [{ text: "Меню", callback_data: "menu" }],
    ]
    if(!answered) keyboard.unshift([...questionsArr[page - 1].answers])
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
});
showSectionQuestionsScene.action("menu", (ctx) => {
  ctx.deleteMessage();
  showMenu(ctx);
  ctx.scene.leave("showSectionQuestions");
});
showSectionQuestionsScene.on("message", async (ctx) => {
  showMenu(ctx);
  ctx.scene.leave("userOrders");
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
      answered: false
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
  showMenu,
};
