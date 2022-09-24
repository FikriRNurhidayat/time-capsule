const cron = require("node-cron");
const { log } = require("../lib");

class Job {
  schedule = "*/2 * * * *";

  dispatch = () => {
    cron.schedule(this.schedule, () => {
      try {
        log.debug("Processing", this.constructor.name);
        this.call();
      } catch (err) {
        log.error(err.message);
        log.debug(err.stack);
      }
    });
  };
}

module.exports = Job;
