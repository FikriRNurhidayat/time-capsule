const errors = require("../errors");
const { User } = require("../models");
const { log } = require("../lib");

class RegisterService {
  constructor({
    passwordManager,
    tokenManager,
    initiateUserEmailVerificationService,
    userRepository,
  }) {
    this.passwordManager = passwordManager;
    this.tokenManager = tokenManager;
    this.initiateUserEmailVerificationService =
      initiateUserEmailVerificationService;
    this.userRepository = userRepository;
  }

  encryptPassword(password) {
    return this.passwordManager.encrypt(password);
  }

  async call({ email, password }) {
    const doesEmailAlreadyTaken = await this.userRepository.findBy({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (doesEmailAlreadyTaken) throw errors.EMAIL_ALREADY_TAKEN;

    const encryptedPassword = this.passwordManager.encrypt(password);
    const user = new User({
      email: email.toLowerCase(),
      isEmailVerified: false,
      encryptedPassword,
    });

    await this.userRepository.save(user);

    this.initiateUserEmailVerificationService
      .call({ id: user.id })
      .catch((err) => {
        log.error(err.message);
        log.debug(err.stack);
      });

    return this.tokenManager.generateToken(user.toTokenPayload());
  }
}

module.exports = RegisterService;
