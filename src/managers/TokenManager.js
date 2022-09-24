const { sign, verify } = require("jsonwebtoken");

class TokenManager {
  constructor({
    accessTokenSecretKey = "Rahasia",
    accessTokenExpiresIn = "10m",
  }) {
    this.accessTokenSecretKey = accessTokenSecretKey;
    this.accessTokenExpiresIn = accessTokenExpiresIn;
  }

  verifyToken = (accessToken) => verify(accessToken, this.accessTokenSecretKey);

  generateToken = (accessTokenPayload) => {
    const accessToken = sign(accessTokenPayload, this.accessTokenSecretKey, {
      expiresIn: this.accessTokenExpiresIn,
    });

    return {
      accessToken,
    };
  };
}

module.exports = TokenManager;
