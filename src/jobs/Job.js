const cron = require("node-cron");
const { log } = require("../lib");

class Job {
  schedule = "*/2 * * * *";

  dispatch = () => {
    cron.schedule(this.schedule, () => {
      log.debug("Processing", this.constructor.name);
      this.call();
    });
  };
}

module.exports = Job;
