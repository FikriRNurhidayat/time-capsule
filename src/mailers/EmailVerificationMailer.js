const Mailer = require("./Mailer");
const { TIME_CAPSULE_EMAIL_VERIFICATION_SUBJECT } = require("../consts");

class EmailVerificationMailer extends Mailer {
  sendMail({ email, emailVerificationURL }) {
    return super.sendMail({
      from: this.username,
      to: email,
      subject: TIME_CAPSULE_EMAIL_VERIFICATION_SUBJECT,
      text: `Please verify your email by clicking this URL ${emailVerificationURL}`,
    });
  }
}

module.exports = EmailVerificationMailer;
