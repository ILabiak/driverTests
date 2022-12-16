'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Users', [
      {
        telegram_id: 77777,
        username: 'testuser1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'testuser2',
        password: 'd1231sda3e12edsacdg12vmsmdfklms',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users');
  },
};
