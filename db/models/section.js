'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Section extends Model {
    static associate(models) {
      Section.hasMany(models.Question, {
        foreignKey: 'section_id',
        as: 'questions',
      });
    }
  }
  Section.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Section',
    },
  );
  return Section;
};
