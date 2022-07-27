const Stage = require("telegraf/stage");
const Scene = require("telegraf/scenes/base");
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");

const questions = require("./questions.json");
const sections = require("./sections.json");

const test = require("./algorithm");
const { toUnicode } = require("punycode");

const numberEmojies = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];

const showMenu = (context) => {
  context.reply(
    "Ви в меню:",
    Markup.keyboard(["Моя інформація"]).resize().extra()
  );
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
  // console.log(ctx.update.callback_query.data)
  // ctx.deleteMessage();
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
    let page;
    let questions = [];
    let questionsArr = [];
    let sectionId = ctx.session.__scenes.state.sectionId;

    if (
      ctx.session.__scenes.state.questionsArr &&
      ctx.session.__scenes.state.page >= 1
    ) {
      questionsArr = ctx.session.__scenes.state.questionsArr;
      page = ctx.session.__scenes.state.page;
      if (page > questionsArr.length) page = questionsArr.length;
    } else {
      questions = test.getSectionQuestions(sectionId);

      for (let question of questions) {
        let counter = 0;
        let questionObj = {
          text: `<b>${question.text}</b>\n\n`,
          image: "https://www.churchnb.org/wp-content/uploads/No.jpg",
          answers: [],
          answered: false,
        };
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
        questionsArr.push(questionObj);
      }
      ctx.session.__scenes.state.questionsArr = questionsArr;
      page = 1;
      ctx.session.__scenes.state.page = page;
    }

    //console.dir(questionsArr[0])
    ctx.telegram.sendPhoto(
      ctx.chat.id,
      {
        url: questionsArr[page - 1].image,
      },
      {
        caption: questionsArr[page - 1].text,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [...questionsArr[page - 1].answers],
            [
              { text: "<", callback_data: "<" },
              { text: ">", callback_data: ">" },
            ],
            // [{ text: "Меню", callback_data: "menu" }],
          ],
        },
      }
    );
    // console.log(JSON.stringify(questionsArr))
  } else {
    ctx.scene.leave("showSectionQuestions");
  }
});
showSectionQuestionsScene.action("1", (ctx) => {
  ctx.reply("правильно");
});
showSectionQuestionsScene.action("0", (ctx) => {
  ctx.reply("не правильно");
});
showSectionQuestionsScene.action(">", (ctx) => {
  ctx.deleteMessage();
  let page = ctx.session.__scenes.state.page;
  page++;
  ctx.scene.enter("showSectionQuestions", {
    page: page,
    questionsArr: ctx.session.__scenes.state.questionsArr,
    sectionId: ctx.session.__scenes.state.sectionId,
  });
});
showSectionQuestionsScene.action("<", (ctx) => {
  ctx.deleteMessage();
  let page = ctx.session.__scenes.state.page;
  page--;
  ctx.scene.enter("showSectionQuestions", {
    page: page,
    questionsArr: ctx.session.__scenes.state.questionsArr,
    sectionId: ctx.session.__scenes.state.sectionId,
  });
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

module.exports = {
  sectionQuestionsScene,
  showSectionQuestionsScene,
  showMenu,
};
