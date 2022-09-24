const { Op } = require("sequelize");
const { log } = require("../lib");

class ReleaseTimeCapsulesService {
  constructor({ releaseTimeCapsuleService, timeCapsuleRepository }) {
    this.timeCapsuleRepository = timeCapsuleRepository;
    this.releaseTimeCapsuleService = releaseTimeCapsuleService;
  }

  async call() {
    let offset = 0;
    let limit = 100;

    const filterArgs = {
      where: {
        active: false,
        releasedAt: {
          [Op.lt]: new Date(),
        },
      },
    };

    const timeCapsuleSize = await this.timeCapsuleRepository.size(filterArgs);

    while (offset <= timeCapsuleSize || offset - timeCapsuleSize <= limit) {
      const findAllArgs = {
        ...filterArgs,
        offset,
        limit,
      };

      const timeCapsules = await this.timeCapsuleRepository.findAll(
        findAllArgs
      );

      timeCapsules.forEach((timeCapsule) =>
        this.releaseTimeCapsuleService.call(timeCapsule).catch((err) => {
          log.error(err.message);
          log.debug(err.stack);
        })
      );

      offset += limit;
    }
  }
}

module.exports = ReleaseTimeCapsulesService;
