const Sequelize = require('sequelize');

const sequelize = new Sequelize('knesset', 'root', '123456Aa', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
