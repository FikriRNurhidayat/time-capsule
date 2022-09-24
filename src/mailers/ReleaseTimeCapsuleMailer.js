const path = require("path");
const Mailer = require("./Mailer");
const { TIME_CAPSULE_BASE_URL } = require("../config");
const { PUBLIC_DIRECTORY } = require("../consts");

class ReleaseTimeCapsuleMailer extends Mailer {
  createAttachments(attachmentUrl) {
    if (attachmentUrl.startsWith(TIME_CAPSULE_BASE_URL)) {
      const fileURL = attachmentUrl.substring(TIME_CAPSULE_BASE_URL.length);
      const filePath = path.join(PUBLIC_DIRECTORY, fileURL);

      return [{ path: filePath }];
    }

    const filename = path.basename(attachmentUrl);

    return [{ filename, path: attachmentUrl }];
  }

  sendMail({ email, subject, message, attachmentUrl }) {
    const sendMailParams = {
      from: this.username,
      to: email,
      subject,
      text: message,
    };

    if (!!attachmentUrl)
      sendMailParams.attachments = this.createAttachments(attachmentUrl);

    return super.sendMail(sendMailParams);
  }
}

module.exports = ReleaseTimeCapsuleMailer;
