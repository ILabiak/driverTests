'use strict';

const questionsData = require('./seed-data/questions-test.json');

const questions = [];

for (const question of questionsData) {
  const answerIds = [];
  for (const answer of question.answers) {
    answerIds.push(answer.id);
  }
  questions.push({
    id: question.id,
    section_id: question.section_id,
    answer_ids: answerIds,
    right_answer_index: question.rightAnswerIndex,
    image: question.image,
  });
}

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Questions', questions, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Questions', null, {});
  },
};
