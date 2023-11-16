const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Bill = sequelize.define('bill', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  knesset_num: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

module.exports = Bill;