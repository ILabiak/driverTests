'use strict';

const paginationKeyboard = [
  { text: '<', callback_data: '<' },
  { text: '>', callback_data: '>' },
];

module.exports = {
  paginationKeyboard,

  numberEmojies: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'],

  formatQuestions(questionsArr) {
    const resultArr = [];
    let questionNumber = 1;
    for (const question of questionsArr) {
      let counter = 0;
      const questionObj = {
        text: `Питання №${questionNumber} з ${questionsArr.length}
    <b>${question.text}</b>\n\n`,
        image:
          question.image ||
          'https://www.churchnb.org/wp-content/uploads/No.jpg',
        answers: [],
        answered: false,
      };
      questionNumber++;
      const answers = [];
      for (const answer of question.answers) {
        questionObj.text += `${this.numberEmojies[counter]} ${answer.text}\n`;
        answers.push({
          text: `${this.numberEmojies[counter]}`,
          callback_data: '0',
        });
        counter++;
      }
      answers[question.rightAnswerIndex].callback_data = '1';
      questionObj.answers = answers;
      resultArr.push(questionObj);
    }
    return resultArr;
  },

  async questionsPaginationCallback(ctx, action) {
    const questionsArr = ctx.session.__scenes.state.questionsArr;
    let page = ctx.session.__scenes.state.page;
    const keyboard = [
      paginationKeyboard,
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
  },

  async answerCallback(ctx, isExam) {
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
            paginationKeyboard,
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
      setTimeout(this.questionsPaginationCallback, 500, ctx, '>');
    }
  },
};
