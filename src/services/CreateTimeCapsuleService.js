const path = require("path");
const fs = require("fs");
const { TimeCapsule } = require("../models");
const { isURL } = require("../lib");
const {
  TIME_CAPSULE_RELEASE_TIME_INVALID,
  TIME_CAPSULE_ATTACHMENT_URL_NOT_VALID,
  TIME_CAPSULE_ATTACHMENT_FILE_NOT_EXISTS,
  TIME_CAPSULE_USER_NOT_VERIFIED,
} = require("../errors");
const { TIME_CAPSULE_BASE_URL } = require("../config");
const { PUBLIC_DIRECTORY } = require("../consts");
const dayjs = require("dayjs");

class CreateTimeCapsuleService {
  constructor({ timeCapsuleRepository, userRepository }) {
    this.timeCapsuleRepository = timeCapsuleRepository;
    this.userRepository = userRepository;
  }

  checkIfReleaseTimeInTheFuture(releasedAt) {
    if (dayjs().isAfter(dayjs(releasedAt)))
      throw TIME_CAPSULE_RELEASE_TIME_INVALID;
  }

  checkIfAttachmentUrlExists(attachmentUrl) {
    if (attachmentUrl.startsWith(TIME_CAPSULE_BASE_URL)) {
      const fileURL = attachmentUrl.substring(TIME_CAPSULE_BASE_URL.length);
      const filePath = path.join(PUBLIC_DIRECTORY, fileURL);

      if (!fs.existsSync(filePath))
        throw TIME_CAPSULE_ATTACHMENT_FILE_NOT_EXISTS;
    }
  }

  async checkIfUserVerified(userId) {
    const user = await this.userRepository.find(userId);
    if (!user.isEmailVerified) throw TIME_CAPSULE_USER_NOT_VERIFIED;
  }

  async call({ subject, message, attachmentUrl, userId, releasedAt }) {
    this.checkIfReleaseTimeInTheFuture(releasedAt);
    if (!!attachmentUrl) this.checkIfAttachmentUrlExists(attachmentUrl);

    await this.checkIfUserVerified(userId);

    const timeCapsule = new TimeCapsule({
      subject,
      message,
      attachmentUrl,
      userId,
      active: false,
      releasedAt,
    });

    await this.timeCapsuleRepository.save(timeCapsule);

    return timeCapsule;
  }
}

module.exports = CreateTimeCapsuleService;
