class Trouble extends Error {
  constructor(code, reason, message, details = undefined) {
    super(message);
    this.code = code;
    this.reason = reason;
    this.message = message;
    this.details = details;
  }

  withDetails = (details) => {
    return new Trouble(this.code, this.reason, this.message, details);
  };

  toJSON() {
    return {
      error: {
        code: this.code,
        reason: this.reason,
        message: this.message,
        details: this.details,
      },
    };
  }
}

module.exports = Trouble;
