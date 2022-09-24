const { TimeCapsule } = require("../models");
const { TYPE_BOOLEAN, TYPE_STRING } = require("../consts");
const errors = require("../errors");
const { typeIs } = require("../lib");
const { SortManager } = require("../managers");

// On the requirement, there's not explanation whether user can list all time capsules
// even tho it includes other people's time capsule or not.
// Hence, I dediced to only include current user's time capsules on the list.
class ListTimeCapsulesService {
  constructor({ timeCapsuleRepository }) {
    this.timeCapsuleRepository = timeCapsuleRepository;
    this.timeCapsuleSortMap = new Map()
      .set("releasedAt", "releasedAt")
      .set("subject", "subject")
      .set("active", "active")
      .set("createdAt", "createdAt")
      .set("updatedAt", "updatedAt");
    this.timeCapsuleSortManager = new SortManager(this.timeCapsuleSortMap);
  }

  async call({ limit = 10, offset = 0, sort, active, userId }) {
    const filterArgs = {
      where: {
        userId,
      },
    };

    if (typeIs(active, TYPE_BOOLEAN)) filterArgs.where = { active };

    const timeCapsuleSize = await this.timeCapsuleRepository.size(filterArgs);

    if (timeCapsuleSize <= offset) throw errors.OUT_OF_RANGE;

    const findAllArgs = {
      ...filterArgs,
      limit,
      offset,
    };
    if ((typeIs(sort), TYPE_STRING))
      findAllArgs.order = this.timeCapsuleSortManager.parse(sort);

    const timeCapsules = await this.timeCapsuleRepository.findAll(findAllArgs);

    return { timeCapsules, timeCapsuleSize };
  }
}

module.exports = ListTimeCapsulesService;
