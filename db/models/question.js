'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    static associate(models) {
      Question.belongsTo(models.Section, {
        foreignKey: 'section_id',
        as: 'section',
      });
    }
    // think about assisiation for answers
    //(use integer array or add question_id to answers table)
  }
  Question.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      section_id: DataTypes.INTEGER,
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      answer_ids: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
      },
      right_answer_index: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: {
        type: DataTypes.TEXT,
        validate: {
          isUrl: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'Question',
    },
  );
  return Question;
};
