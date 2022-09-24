const {
  TIME_CAPSULE_MISMATCH_OWNER,
  TIME_CAPSULE_INACTIVE,
  TIME_CAPSULE_NOT_FOUND,
} = require("../errors");

class GetTimeCapsuleService {
  constructor({ timeCapsuleRepository }) {
    this.timeCapsuleRepository = timeCapsuleRepository;
  }

  async call({ id, userId }) {
    const timeCapsule = await this.timeCapsuleRepository.find(id);

    if (!timeCapsule) throw TIME_CAPSULE_NOT_FOUND;
    if (timeCapsule.userId !== userId) throw TIME_CAPSULE_MISMATCH_OWNER;
    if (!timeCapsule.active) throw TIME_CAPSULE_INACTIVE;

    return timeCapsule;
  }
}

module.exports = GetTimeCapsuleService;
