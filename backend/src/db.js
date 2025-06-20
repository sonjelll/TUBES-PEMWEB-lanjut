const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('food-recipe', 'root', 'oop', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Disable logging; default: console.log
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

module.exports = sequelize;
