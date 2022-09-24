const { TimeCapsule } = require("../models");

class TimeCapsuleRepository {
  find(...args) {
    return TimeCapsule.findByPk(...args);
  }

  findBy(...args) {
    return TimeCapsule.findOne(...args);
  }

  findAll(...args) {
    return TimeCapsule.findAll(...args);
  }

  size(...args) {
    return TimeCapsule.count(...args);
  }

  destroy(timeCapsule) {
    return timeCapsule.destroy();
  }

  save(timeCapsule) {
    return timeCapsule.save();
  }
}

module.exports = TimeCapsuleRepository;
