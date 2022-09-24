"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValues: Sequelize.UUIDV4,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      encryptedPassword: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      encryptedEmailVerificationToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN,
        default: true,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
