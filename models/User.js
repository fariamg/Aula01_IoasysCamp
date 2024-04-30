// models/User.js
const Sequelize = require('sequelize');
const sequelize = require('../sequelize');
const bcrypt = require('bcrypt');

const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      isAlphanumeric: {
        args: true,
        msg: 'The username can only contain letters and numbers',
      },
      len: {
        args: [3, 20],
        msg: 'The username must be between 3 and 20 characters long',
      },
      notEmpty: {
        args: true,
        msg: 'The username is required',
      },
    },
  },
  password: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      len: {
        args: [8, 100],
        msg: 'The password must be at least 8 characters long',
      },
      notEmpty: {
        args: true,
        msg: 'The password is required',
      },
    },
  },
  hooks: {
    beforeCreate: async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    },
  },
});

module.exports = User;