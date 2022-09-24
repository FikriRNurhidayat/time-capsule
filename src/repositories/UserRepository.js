const { User } = require("../models");

class UserRepository {
  find(...args) {
    return User.findByPk(...args);
  }

  findBy(...args) {
    return User.findOne(...args);
  }

  findAll(...args) {
    return User.findAll(...args);
  }

  destroy(user) {
    return user.destroy();
  }

  save(user) {
    return user.save();
  }
}

module.exports = UserRepository;
