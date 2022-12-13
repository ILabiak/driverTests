'use strict';

const questions = require('./seed-data/questions-test.json');

let answers = [];

questions.forEach((el) => answers.push(el.answers));

answers = answers.flat();
answers.forEach((el) => {
  delete el.id;
  el.createdAt = new Date();
  el.updatedAt = new Date();
});

console.dir(answers);

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Answers', answers);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Answers');
  },
};
