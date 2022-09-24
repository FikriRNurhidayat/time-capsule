const { ReleaseTimeCapsulesJob } = require("./jobs");
const { TimeCapsuleRepository } = require("./repositories");
const { ReleaseTimeCapsulesService } = require("./services");
const { TYPE_FUNCTION } = require("./consts");
const { log, typeIs } = require("./lib");

exports.start = function start(cb) {
  const jobs = [];
  const timeCapsuleRepository = new TimeCapsuleRepository();
  const releaseTimeCapsulesService = new ReleaseTimeCapsulesService({
    timeCapsuleRepository,
  });

  jobs.push(
    new ReleaseTimeCapsulesJob({
      releaseTimeCapsulesService,
    })
  );

  jobs.forEach((job) => job.dispatch());

  if (typeIs(cb, TYPE_FUNCTION)) cb();
};
