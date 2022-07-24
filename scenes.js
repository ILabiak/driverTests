const Stage = require("telegraf/stage");
const Scene = require("telegraf/scenes/base");
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");

const questions = require("./questions.json");
const sections = require("./sections.json");

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

  if (
    ctx.session.__scenes.state.sectionsArr &&
    ctx.session.__scenes.state.sectionNames
  ) {
    //check if sectionsArr and sectionNames were already created in scene
    sectionsArr = ctx.session.__scenes.state.sectionsArr;
    sectionNames = ctx.session.__scenes.state.sectionNames;
  } else {
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
  }
  if (ctx.session.__scenes.state.page && ctx.session.__scenes.state.page >= 1) {
    //check if page given while entering scene
    let pageLimit = Math.ceil(sections.length / 5);
    if (ctx.session.__scenes.state.page > pageLimit) {
      page = pageLimit;
    } else {
      page = ctx.session.__scenes.state.page;
    }
  } else {
    page = 1;
    ctx.session.__scenes.state.page = page;
  }

  pageSections = sectionsArr.slice(page * 5 - 5, page * 5);
  message += sectionNames.slice(page * 5 - 5, page * 5).join("");

  // console.log(message)
  // console.log(pageSections)

  ctx.telegram.sendMessage(ctx.chat.id, message, {
    reply_markup: {
      inline_keyboard: [
        [...pageSections],
        [
          { text: "<<", callback_data: "<<" },
          { text: ">>", callback_data: ">>" },
        ],
        // [{ text: "Меню", callback_data: "menu" }],
      ],
    },
  });
});
sectionQuestionsScene.action(">>", (ctx) => {
  ctx.deleteMessage();
  let page = ctx.session.__scenes.state.page;
  page++;
  ctx.scene.enter("sectionQuestions", {
    page: page,
    sectionsArr: ctx.session.__scenes.state.sectionsArr,
    sectionNames: ctx.session.__scenes.state.sectionNames,
  });
});
sectionQuestionsScene.action("<<", (ctx) => {
  ctx.deleteMessage();
  let page = ctx.session.__scenes.state.page;
  page--;
  ctx.scene.enter("sectionQuestions", {
    page: page,
    sectionsArr: ctx.session.__scenes.state.sectionsArr,
    sectionNames: ctx.session.__scenes.state.sectionNames,
  });
});
sectionQuestionsScene.action(/^\d+$/, async (ctx) => {
    console.log(ctx.update.callback_query.data)
})
sectionQuestionsScene.hears("Меню", (ctx) => {
  showMenu(ctx);
  ctx.scene.leave("sectionQuestions");
});
sectionQuestionsScene.on("message", (ctx) => {
  if (parseInt(ctx.message.text) >= 0) {
    let paymentAmount = parseInt(ctx.message.text);
    ctx.scene.enter("paymentMethod", { amount: paymentAmount });
  } else {
    ctx.scene.enter("sectionQuestions");
  }
});

const userOrdersScene = new Scene("userOrders");
userOrdersScene.enter(async (ctx) => {
  let page;
  let sectionsArr = [];
  let pageSections = [];

  if (ctx.session.__scenes.state.sectionsArr) {
    //check if sectionsArr was already created in scene
    sectionsArr = ctx.session.__scenes.state.sectionsArr;
  } else {
    for (let el of sections) {
      sectionsArr.push({
        text: el.name,
        callback_data: el.id,
      });
    }
  }

  if (ctx.session.__scenes.state.page && ctx.session.__scenes.state.page >= 1) {
    //check if page given while entering scene
    page = ctx.session.__scenes.state.counter;
  } else {
    page = 1;
    ctx.session.__scenes.state.page = page;
  }

  //   if (page < 1) page = 1;
  //   if (page == )
  //     keyboardArr[page].push({ text: ">>", callback_data: ">>" });
  //   else if (page == keyboardArr.length - 1)
  //     keyboardArr[page].push({ text: "<<", callback_data: "<<" });
  //   else if (page > 0 && counter < keyboardArr.length - 1) {
  //     keyboardArr[page].unshift({ text: "<<", callback_data: "<<" });
  //     //keyboardArr[page].push({ text: ">>", callback_data: ">>" });
  //   }
  ctx.telegram.sendMessage(ctx.chat.id, "Список тем:", {
    reply_markup: {
      inline_keyboard: [
        [...keyboardArr[counter]],
        [{ text: "Меню", callback_data: "menu" }],
      ],
    },
  });
});
userOrdersScene.action(">>", (ctx) => {
  ctx.deleteMessage();
  let counter = ctx.session.__scenes.state.counter;
  counter++;
  ctx.scene.enter("userOrders", {
    telegramId: ctx.session.__scenes.state.telegramId,
    counter: counter,
    arr: ctx.session.__scenes.state.arr,
    keyboardArr: ctx.session.__scenes.state.keyboardArr,
  });
});
userOrdersScene.action("<<", (ctx) => {
  ctx.deleteMessage();
  let counter = ctx.session.__scenes.state.counter;
  counter--;
  ctx.scene.enter("userOrders", {
    telegramId: ctx.session.__scenes.state.telegramId,
    counter: counter,
    arr: ctx.session.__scenes.state.arr,
    keyboardArr: ctx.session.__scenes.state.keyboardArr,
  });
});
userOrdersScene.action("menu", (ctx) => {
  ctx.deleteMessage();
  showMenu(ctx);
  ctx.scene.leave("userOrders");
});
userOrdersScene.action(/^\d+$/, async (ctx) => {
  const message = ctx.update.callback_query.data;
  const ordersArr = ctx.session.__scenes.state.arr;
  if (ordersArr.includes(message)) {
    const orderId = parseInt(message);
    const apiOrderDetails = await api.getOrderDetails(orderId);
    const dbOrderDetails = await db.getOrderDetails(orderId);
    if (apiOrderDetails.charge < dbOrderDetails.charge) {
      const chargeDiff = dbOrderDetails.charge - apiOrderDetails.charge;
      const telegramId = ctx.update.message.from.id;
      await db.changeBalance(telegramId, chargeDiff);
    }
    await db.updateOrderDetails(
      orderId,
      apiOrderDetails.charge,
      apiOrderDetails.start_count,
      apiOrderDetails.status,
      apiOrderDetails.remains
    );
    const orderInfo = apiOrderDetails.text + `Ссылка: ${dbOrderDetails.link}`;
    ctx.reply(orderInfo);
  } else {
    showMenu(ctx);
    ctx.scene.leave("userOrders");
  }
});
userOrdersScene.on("message", async (ctx) => {
  showMenu(ctx);
  ctx.scene.leave("userOrders");
});

module.exports = {
  sectionQuestionsScene,
  showMenu,
};
