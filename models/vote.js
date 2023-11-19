const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Vote = sequelize.define('vote', {
  billId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  mkId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  mkName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  mkVote: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Vote;