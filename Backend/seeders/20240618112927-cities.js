'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Cities', [
      {
        name: 'Delhi NCR',
        code: 'delhi-ncr',
        timezone: 'Asia/Kolkata',
        status: 1,
        createdat: new Date(),
        updatedat: new Date(),
      },
      {
        name: 'Mumbai',
        code: 'mumbai',
        timezone: 'Asia/Kolkata',
        status: 1,
        createdat: new Date(),
        updatedat: new Date(),
      },
      {
        name: 'Bengaluru',
        code: 'bengaluru',
        timezone: 'Asia/Kolkata',
        status: 1,
        createdat: new Date(),
        updatedat: new Date(),
      },
      // Add more city entries here
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Cities', null, {});
  }
};
