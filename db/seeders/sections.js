'use strict';

const sections = require('./seed-data/sections-test.json');

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Sections', sections);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Sections');
  },
};
