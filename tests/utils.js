const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const { faker } = require("@faker-js/faker");
const {
  ACCESS_TOKEN_SECRET_KEY,
  ACCESS_TOKEN_EXPIRES_IN,
  TIME_CAPSULE_BASE_URL,
} = require("../src/config");
const { UPLOAD_DIRECTORY } = require("../src/consts");
const { TimeCapsule } = require("../src/models");
const { TokenManager } = require("../src/managers");

const tokenManager = new TokenManager({
  accessTokenSecretKey: ACCESS_TOKEN_SECRET_KEY,
  accessTokenExpiresIn: ACCESS_TOKEN_EXPIRES_IN,
});

function mockMailer(server) {
  const mockSendMail = jest.fn();
  server.emailVerificationMailer = {
    sendMail: mockSendMail,
  };
  server.initiateUserEmailVerificationService.emailVerificationMailer =
    server.emailVerificationMailer;
  return server;
}

async function createUserAndGetToken(
  server,
  { email = faker.internet.email(), password = faker.internet.password() } = {}
) {
  server = mockMailer(server);
  const { accessToken } = await server.registerService.call({
    email,
    password,
  });

  const { id } = tokenManager.verifyToken(accessToken);

  return { id, email, accessToken };
}

async function createVerifiedUserAndGetToken(
  server,
  { email = faker.internet.email(), password = faker.internet.password() } = {}
) {
  const { id, accessToken } = await createUserAndGetToken(server, {
    email,
    password,
  });

  await verifyUserByEmail(server, email);

  return { id, email, accessToken };
}

async function removeUserByEmail(server, email) {
  const user = await server.userRepository.findBy({
    where: { email: email.toLocaleLowerCase() },
  });

  return server.userRepository.destroy(user);
}

async function removeTimeCapsule(server, id) {
  const timeCapsule = await server.timeCapsuleRepository.find(id);
  return server.timeCapsuleRepository.destroy(timeCapsule);
}

async function createFileURL(ext = "txt") {
  const filename = `TEST-${Date.now()}.${ext}`;
  const filepath = path.join(UPLOAD_DIRECTORY, filename);
  fs.writeFileSync(filepath, faker.lorem.paragraphs(2));

  return `${TIME_CAPSULE_BASE_URL}/uploads/${filename}`;
}

async function verifyUserByEmail(server, email) {
  const user = await server.userRepository.findBy({
    where: { email: email.toLocaleLowerCase() },
  });

  user.isEmailVerified = true;

  return server.userRepository.save(user);
}

async function createTimeCapsule(
  server,
  {
    subject = faker.lorem.sentence(),
    message = faker.lorem.paragraph(),
    active = false,
    attachmentUrl = faker.internet.url(),
    userId,
    releasedAt = dayjs().add(7, "days"),
  }
) {
  const timeCapsule = new TimeCapsule({
    subject,
    message,
    active,
    attachmentUrl,
    userId,
    releasedAt,
  });

  await server.timeCapsuleRepository.save(timeCapsule);

  return timeCapsule;
}

module.exports = {
  mockMailer,
  createUserAndGetToken,
  createVerifiedUserAndGetToken,
  createTimeCapsule,
  createFileURL,
  removeUserByEmail,
  removeTimeCapsule,
  verifyUserByEmail,
};
