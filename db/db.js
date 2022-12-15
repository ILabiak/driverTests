'use strict';

// require('dotenv').config();

const db = require('./models');

const Answer = require('./models').Answer;

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
    // await db.Answer.create({
    //   text: 'testing',
    // });
    const question = await db.Question.findByPk(3).then(async (question) => {
      if (!question) {
        console.log('No question found.');
        return;
      }
      const questionRes = {
        id: question.id,
        section_id: question.section_id,
        text: question.text,
        answers: [],
        rightAnswerIndex: question.right_answer_index,
        image: question.image,
      };
      await Answer.findAll({
        where: {
          id: question.answer_ids,
        },
      })
        .then((answers) => {
          if (answers.length === question.answer_ids.length) {
            // console.dir(answers[0].dataValues);
            answers.forEach((el) => {
              questionRes.answers.push({
                id: el.id,
                text: el.text,
              });
            });
          }
          return new Error('test error');
          // res.status(400).send(new Error("Couldn't find question answers"));
        })
        .catch((error) => {
          console.log(error);
          //res.status(400).send(error);
        });
      return questionRes;
    });
    console.dir(question);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

/*

PostgreSQL models:

1. Users:
id: INTEGER, PRIMARY KEY, AUTO INCREMENT, NOT NULL
telegram_id: INTEGER, UNIQUE
username: STRING
(Maybe add passhash)

2. Sections:
id: INTEGER, PRIMARY KEY, AUTO INCREMENT, NOT NULL
(think about a way to save old sectionIds from json)
name: STRING
(maybe section_id)

3. Questions:
id: INTEGER, PRIMARY KEY, AUTO INCREMENT, NOT NULL
section_id: INTEGER
text: STRING, NOT NULL
answers: INTEGER (maybe string) ARRAY, NOT NULL
(or make another table for answers and store here INTEGER ARRAY)
right_answer_index: INTEGER, NOT NULL
image: STRING (link)

4.(MAYBE) Answers:
id: INTEGER, PRIMARY KEY, AUTO INCREMENT, NOT NULL
text: STRING, NOT NULL


*/
