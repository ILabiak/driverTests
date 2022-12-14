'use strict';

const questionsDataJson = require('./seed-data/questions-test.json');

const questionsData = JSON.parse(JSON.stringify(questionsDataJson));

module.exports = {
  async up(queryInterface, sequelize) {
    const questions = [];

    for (const question of questionsData) {
      const answerIds = [];
      for (const answer of question.answers) {
        answerIds.push(answer.id);
      }
      questions.push({
        section_id: Number(question.section_id),
        text: question.text,
        answer_ids: sequelize.literal(`array[${[...answerIds]}]`),
        right_answer_index: question.rightAnswerIndex,
        image: question.image,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('Questions', questions, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Questions', null, {});
  },
};
