const { Sequelize } = require('sequelize');
const path = require('path');

const dbPath = path.resolve(__dirname, '../notes.db');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  dialectOptions: {
    busyTimeout: 50000
  }
});

sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(error => console.error('Unable to connect to the database:', error));

module.exports = sequelize;