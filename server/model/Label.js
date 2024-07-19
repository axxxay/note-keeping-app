const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Label = sequelize.define('tags', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
  }, {
        freezeTableName: true,
        timestamps: false,
  });
  
  module.exports = Label;
  