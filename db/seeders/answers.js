'use strict';

const questionsDataJson = require('./seed-data/questions.json');

const questionsData = JSON.parse(JSON.stringify(questionsDataJson));

let answers = [];

questionsData.forEach((el) => answers.push(el.answers));

answers = answers.flat();
answers.forEach((el) => {
  delete el.id;
  el.createdAt = new Date();
  el.updatedAt = new Date();
});

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Answers', answers);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Answers');
  },
};
