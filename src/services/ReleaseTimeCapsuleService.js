const { USER_NOT_FOUND } = require("../errors");
const { log } = require("../lib");

class ReleaseTimeCapsuleService {
  constructor({
    releaseTimeCapsuleMailer,
    userRepository,
    timeCapsuleRepository,
  }) {
    this.userRepository = userRepository;
    this.timeCapsuleRepository = timeCapsuleRepository;
    this.releaseTimeCapsuleMailer = releaseTimeCapsuleMailer;
  }

  async call(timeCapsule) {
    const user = await this.userRepository.find(timeCapsule.userId);
    if (!user) throw USER_NOT_FOUND;

    // Run mailer on the background
    // If the setup is correct
    // the only possible error is that the user tries to insert
    // invalid attachment url, hence we shouldn't really retry it.
    this.releaseTimeCapsuleMailer
      .sendMail({
        email: user.email,
        subject: timeCapsule.subject,
        message: timeCapsule.message,
        attachmentUrl: timeCapsule.attachmentUrl,
      })
      .catch((err) => {
        log.error(err.message);
        log.debug(err.stack);
      });

    timeCapsule.active = true;

    await this.timeCapsuleRepository.save(timeCapsule);
  }
}

module.exports = ReleaseTimeCapsuleService;
