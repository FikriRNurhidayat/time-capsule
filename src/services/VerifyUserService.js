const {
  USER_NOT_FOUND,
  EMAIL_VERIFICATION_TOKEN_NOT_VALID,
} = require("../errors");

class VerifyUserService {
  constructor({ userRepository, passwordManager }) {
    this.userRepository = userRepository;
    this.passwordManager = passwordManager;
  }

  checkEmailVerificationToken(user, emailVerificationToken) {
    if (
      !this.passwordManager.compare(
        emailVerificationToken,
        user.encryptedEmailVerificationToken || ""
      )
    )
      throw EMAIL_VERIFICATION_TOKEN_NOT_VALID;
  }

  async call({ id, emailVerificationToken }) {
    const user = await this.userRepository.find(id);
    if (!user) throw USER_NOT_FOUND;

    this.checkEmailVerificationToken(user, emailVerificationToken);

    user.isEmailConfirmed = true;
    await this.userRepository.save(user);
  }
}

module.exports = VerifyUserService;
