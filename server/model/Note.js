const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Note = sequelize.define('notes', {
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
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    bg_color: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    archived: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    trashed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    reminder_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    labels: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    trashed_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
  }, {
        freezeTableName: true,
        timestamps: false,
  });
  
  module.exports = Note;
  