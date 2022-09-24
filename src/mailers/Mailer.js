const {
  TIME_CAPSULE_MAILER_USER,
  TIME_CAPSULE_MAILER_CLIENT_ID,
  TIME_CAPSULE_MAILER_CLIENT_SECRET,
  TIME_CAPSULE_MAILER_REDIRECT_URI,
  TIME_CAPSULE_MAILER_REFRESH_TOKEN,
} = require("../config");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const { log } = require("../lib");

class Mailer {
  constructor() {
    this.user = TIME_CAPSULE_MAILER_USER;
    this.clientId = TIME_CAPSULE_MAILER_CLIENT_ID;
    this.clientSecret = TIME_CAPSULE_MAILER_CLIENT_SECRET;
    this.redirectUri = TIME_CAPSULE_MAILER_REDIRECT_URI;
    this.refreshToken = TIME_CAPSULE_MAILER_REFRESH_TOKEN;
    this.oauth2Client = this.createOAuth2Client();
    this.transporter = this.createTransporter();
  }

  createOAuth2Client() {
    const oAuth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.redirectUri
    );

    oAuth2Client.setCredentials({ refresh_token: this.refreshToken });
    return this.oauth2Client;
  }

  createTransporter() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: this.user,
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        refreshToken: this.refreshToken,
      },
    });
  }

  async sendMail(params) {
    const mail = await this.transporter.sendMail(params);

    log.debug("Message sent:", mail.messageId);
  }
}

module.exports = Mailer;
