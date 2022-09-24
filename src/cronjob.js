const { ReleaseTimeCapsulesJob } = require("./jobs");
const { ReleaseTimeCapsuleMailer } = require("./mailers");
const { TimeCapsuleRepository, UserRepository } = require("./repositories");
const {
  ReleaseTimeCapsuleService,
  ReleaseTimeCapsulesService,
} = require("./services");
const { TYPE_FUNCTION } = require("./consts");
const { log, typeIs } = require("./lib");

exports.start = function start(cb) {
  const jobs = [];

  // Common Repositories
  const timeCapsuleRepository = new TimeCapsuleRepository();
  const userRepository = new UserRepository();

  // Common Mailer
  const releaseTimeCapsuleMailer = new ReleaseTimeCapsuleMailer();

  // Common Service
  const releaseTimeCapsuleService = new ReleaseTimeCapsuleService({
    releaseTimeCapsuleMailer,
    userRepository,
    timeCapsuleRepository,
  });
  const releaseTimeCapsulesService = new ReleaseTimeCapsulesService({
    releaseTimeCapsuleService,
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
