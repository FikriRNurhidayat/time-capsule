const Job = require("./Job");
const { TIME_CAPSULE_RELEASE_TIME_CAPSULE_JOB_CRON } = require("../config");

class ReleaseTimeCapsulesJob extends Job {
  schedule = TIME_CAPSULE_RELEASE_TIME_CAPSULE_JOB_CRON;

  constructor({ releaseTimeCapsulesService }) {
    super();
    this.releaseTimeCapsulesService = releaseTimeCapsulesService;
  }

  call = () => {
    this.releaseTimeCapsulesService.call();
  };
}

module.exports = ReleaseTimeCapsulesJob;
