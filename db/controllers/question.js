'use strict';
const Question = require('../models').Question;
const Answer = require('../models').Answer;
const sequelize = require('sequelize');

async function handleQuestion(question, res) {
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
        answers.forEach((el) => {
          questionRes.answers.push({
            id: el.id,
            text: el.text,
          });
        });
      }
    })
    .catch((error) => res.status(400).send(error));
  return questionRes;
}

async function findRandomQuestion(sectionIds, res) {
  return Question.findAll({
    where: {
      section_id: sectionIds,
    },
  })
    .then(async (questions) => {
      const randomQuestion =
        questions[Math.floor(Math.random() * questions.length)];
      const questionsRes = await handleQuestion(randomQuestion, res);
      return questionsRes;
    })
    .catch((error) => {
      res.status(400).send(error);
    });
}

/*
This structure is similair to official driving tests
and it tells from what sections to take question for exam
For inctance, sixth question contains random question from section 11 or 12
*/
const examStructure = [
  [2, 4, 5, 6, 7, 20], // 1
  [3, 27, 32], // 2
  [35, 36, 37, 38, 39, 40, 41], // 3
  [42], // 4
  [10, 21], // 5
  [11, 12], // 6
  [13, 14, 15], // 7
  [16, 19], // 8
  [8, 18, 9, 17], // 9
  [45], // 10
  [22, 28, 29, 30, 31, 34], // 11
  [23, 24, 25, 26], // 12
  [45], // 13
  [44, 47, 50], // 14
  [35, 36, 37, 38, 39, 40, 41], // 15
  [46], // 16
  [1, 48], // 17
  [33, 49], // 18
  [43, 51], // 19
  [43], // 20
];

module.exports = {
  getById(req, res) {
    return Question.findByPk(req.params.id).then(async (question) => {
      if (!question) {
        return res.status(400).send({
          message: 'Question Not Found',
        });
      }
      const questionRes = await handleQuestion(question, res);
      res.status(200).send(questionRes);
    });
  },

  getBySectionId(req, res) {
    return Question.findAll({
      where: {
        section_id: req.params.section_id,
      },
    })
      .then(async (questions) => {
        const questionsRes = [];
        for (const question of questions) {
          const handledQuestion = await handleQuestion(question, res);
          questionsRes.push(handledQuestion);
        }
        res.status(200).send(questionsRes);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getRandomQuestions(req, res) {
    return Question.findAll({
      order: sequelize.literal('random()'),
      limit: req.params.quantity,
    })
      .then((questions) => {
        res.status(200).send(questions);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getRandomQuestion(req, res) {
    return findRandomQuestion(req.body.section_ids, res);
  },

  async getExamQuestions(req, res) {
    const examQuestions = [];
    for (let i = 0; i < 20; i++) {
      let question;
      do {
        question = await findRandomQuestion(examStructure[i], res);
      } while (examQuestions.includes(question));
      examQuestions.push(question);
    }
    return examQuestions;
  },

  add(req, res) {
    /*
    Firstly we add answers to database
    Then we get their ids and add question to database
    User gets full question in responce with question and answer ids
    */
    if (!req.body.answers) {
      return res.status(400).send({
        message: 'Object shoud contain answers.',
      });
    }
    return Answer.bulkCreate(req.body.answers, {
      fields: ['text'],
      returning: ['id'],
    })
      .then((answers) => {
        const answerIds = [];
        for (const answer of answers) {
          answerIds.push(answer.id);
        }
        return Question.create({
          section_id: req.body.section_id,
          text: req.body.text,
          answer_ids: sequelize.literal(`array[${[...answerIds]}]`),
          right_answer_index: req.body.rightAnswerIndex,
          image: req.body.image,
        })
          .then(async (question) => {
            const questionRes = await handleQuestion(question, res);
            res.status(200).send(questionRes);
          })
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return Question.findByPk(req.params.id)
      .then((question) => {
        if (!question) {
          return res.status(400).send({
            message: 'Question Not Found',
          });
        }
        Answer.destroy({
          where: {
            id: question.answer_ids,
          },
        }).catch((error) => res.status(400).send(error));
        return question
          .destroy()
          .then(() =>
            res
              .status(200)
              .send({ message: 'Question was successfully deleted!' }),
          )
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
