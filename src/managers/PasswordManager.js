const bcrypt = require("bcryptjs");

class PasswordManager {
  constructor({ salt = 10 }) {
    this.salt = salt;
  }

  compare(password, encryptedPassword) {
    return bcrypt.compareSync(password, encryptedPassword);
  }

  encrypt(password) {
    return bcrypt.hashSync(password, this.salt);
  }
}

module.exports = PasswordManager;
