'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const createPost = queryInterface.createTable('BlogPosts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false, 
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      published: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updated: {
        type: Sequelize.DATE,
      },
    });
    return createPost;
  },

  down: async (queryInterface, _Sequelize) => await queryInterface.dropTable('BlogPosts'),
};