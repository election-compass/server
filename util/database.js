const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.CLOUD_SQL_DATABASE, process.env.CLOUD_SQL_USERNAME, process.env.CLOUD_SQL_PASSWORD, {
  dialect: 'mysql',
  host: process.env.CLOUD_SQL_HOST,
  port: process.env.CLOUD_SQL_PORT,
});

module.exports = sequelize;