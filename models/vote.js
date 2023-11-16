const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Vote = sequelize.define('vote', {
  bill_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  kn_member_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  kn_member_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  kn_member_vote: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Vote;