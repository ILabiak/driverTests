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
