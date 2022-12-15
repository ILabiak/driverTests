'use strict';

const sectionsDataJson = require('./seed-data/sections.json');

const sections = JSON.parse(JSON.stringify(sectionsDataJson));

sections.forEach((el) => {
  delete el.id;
  el.createdAt = new Date();
  el.updatedAt = new Date();
});

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Sections', sections);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Sections');
  },
};
