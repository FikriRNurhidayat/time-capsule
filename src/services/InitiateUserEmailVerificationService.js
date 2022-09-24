const { TIME_CAPSULE_BASE_URL } = require("../config");
const { EMAIL_ALREADY_VERIFIED } = require("../errors");
const { v4: uuid } = require("uuid");
const { log } = require("../lib");

class InitiateUserEmailVerificationService {
  constructor({ passwordManager, userRepository, emailVerificationMailer }) {
    this.passwordManager = passwordManager;
    this.userRepository = userRepository;
    this.emailVerificationMailer = emailVerificationMailer;
  }

  generateEmailVerificationToken = () => uuid();
  encryptEmailVerificationToken = (token) =>
    this.passwordManager.encrypt(token);

  generateEmailVerificationURL(id, emailVerificationToken) {
    const queryParams = new URLSearchParams({ emailVerificationToken });
    return `${TIME_CAPSULE_BASE_URL}/v1/users/${id}/verify?${queryParams.toString()}`;
  }

  async call({ id }) {
    const user = await this.userRepository.find(id);
    const emailVerificationToken = this.generateEmailVerificationToken();

    if (user.isEmailVerified) throw EMAIL_ALREADY_VERIFIED;

    user.encryptedEmailVerificationToken = this.encryptEmailVerificationToken(
      emailVerificationToken
    );

    await this.userRepository.save(user);
    await this.emailVerificationMailer.sendMail({
      email: user.email,
      emailVerificationURL: this.generateEmailVerificationURL(
        user.id,
        emailVerificationToken
      ),
    });
  }
}

module.exports = InitiateUserEmailVerificationService;
