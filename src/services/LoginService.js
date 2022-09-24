const errors = require("../errors");

class LoginService {
  constructor({ passwordManager, tokenManager, userRepository }) {
    this.passwordManager = passwordManager;
    this.tokenManager = tokenManager;
    this.userRepository = userRepository;
  }

  isPasswordCorrect(password, encryptedPassword) {
    return this.passwordManager.compare(password, encryptedPassword);
  }

  async call({ email, password }) {
    const user = await this.userRepository.findBy({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) throw errors.EMAIL_NOT_FOUND;
    if (!this.isPasswordCorrect(password, user.encryptedPassword))
      throw errors.WRONG_PASSWORD;

    return this.tokenManager.generateToken(user.toTokenPayload());
  }
}

module.exports = LoginService;
