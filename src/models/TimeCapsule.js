"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TimeCapsule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }

    toDetailJSON() {
      return {
        id: this.id,
        subject: this.subject,
        message: this.message,
        active: this.active,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        releasedAt: this.releasedAt,
      };
    }

    toJSON() {
      return {
        id: this.id,
        subject: this.subject,
        active: this.active,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        releasedAt: this.releasedAt,
      };
    }
  }
  TimeCapsule.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      attachmentUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      releasedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "TimeCapsule",
      tableName: "time_capsules",
    }
  );
  return TimeCapsule;
};
