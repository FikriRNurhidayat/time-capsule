const request = require("supertest");
const http = require("http");
const { faker } = require("@faker-js/faker");
const dayjs = require("dayjs");
const { TIME_CAPSULE_BASE_URL } = require("../../../../src/config");
const {
  TIME_CAPSULE_ATTACHMENT_FILE_NOT_EXISTS,
  TIME_CAPSULE_USER_NOT_VERIFIED,
} = require("../../../../src/errors");
const {
  mockMailer,
  createVerifiedUserAndGetToken,
  removeUserByEmail,
  removeTimeCapsule,
  createFileURL,
  createUserAndGetToken,
} = require("../../../utils");
const createServer = require("../../../../src/createServer");
const configureRoute = require("../../../../src/configureRoute");

describe("POST /v1/time-capsules", () => {
  test("OK", async () => {
    const server = mockMailer(configureRoute(createServer()));
    const { email, accessToken } = await createVerifiedUserAndGetToken(server);

    const subject = faker.lorem.words(5);
    const message = faker.lorem.sentences(2);
    const releasedAt = dayjs().add(7, "days");

    const app = http.createServer(server);
    const response = await request(app)
      .post("/v1/time-capsules")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + accessToken)
      .send({ subject, message, releasedAt: releasedAt.toISOString() });

    expect(response.status).toEqual(201);
    expect(response.body.timeCapsule).toEqual({
      id: expect.any(String),
      subject,
      active: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      releasedAt: releasedAt.toISOString(),
    });

    await removeTimeCapsule(server, response.body.timeCapsule.id);
    await removeUserByEmail(server, email);

    await app.close();
  });
  test("OK_WITH_LOCAL_ATTACHMENT", async () => {
    const server = mockMailer(configureRoute(createServer()));
    const { email, accessToken } = await createVerifiedUserAndGetToken(server);
    const attachmentUrl = await createFileURL();

    const subject = faker.lorem.words(5);
    const message = faker.lorem.sentences(2);
    const releasedAt = dayjs().add(7, "days");

    const app = http.createServer(server);
    const response = await request(app)
      .post("/v1/time-capsules")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + accessToken)
      .send({
        subject,
        message,
        attachmentUrl,
        releasedAt: releasedAt.toISOString(),
      });

    expect(response.status).toEqual(201);
    expect(response.body.timeCapsule).toEqual({
      id: expect.any(String),
      subject,
      active: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      releasedAt: releasedAt.toISOString(),
    });

    await removeTimeCapsule(server, response.body.timeCapsule.id);
    await removeUserByEmail(server, email);

    await app.close();
  });
  test("OK_WITH_EXTERNAL_ATTACHMENT", async () => {
    const server = mockMailer(configureRoute(createServer()));
    const { email, accessToken } = await createVerifiedUserAndGetToken(server);
    const attachmentUrl = faker.internet.url();

    const subject = faker.lorem.words(5);
    const message = faker.lorem.sentences(2);
    const releasedAt = dayjs().add(7, "days");

    const app = http.createServer(server);
    const response = await request(app)
      .post("/v1/time-capsules")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + accessToken)
      .send({
        subject,
        message,
        attachmentUrl,
        releasedAt: releasedAt.toISOString(),
      });

    expect(response.status).toEqual(201);
    expect(response.body.timeCapsule).toEqual({
      id: expect.any(String),
      subject,
      active: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      releasedAt: releasedAt.toISOString(),
    });

    await removeTimeCapsule(server, response.body.timeCapsule.id);
    await removeUserByEmail(server, email);
    await app.close();
  });
  test("TIME_CAPSULE_USER_NOT_VERIFIED", async () => {
    const server = mockMailer(configureRoute(createServer()));
    const { email, accessToken } = await createUserAndGetToken(server);
    const attachmentUrl = faker.internet.url();

    const subject = faker.lorem.words(5);
    const message = faker.lorem.sentences(2);
    const releasedAt = dayjs().add(7, "days");

    const app = http.createServer(server);
    const response = await request(app)
      .post("/v1/time-capsules")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + accessToken)
      .send({
        subject,
        message,
        attachmentUrl,
        releasedAt: releasedAt.toISOString(),
      });

    expect(response.status).toEqual(422);
    expect(response.body).toEqual(TIME_CAPSULE_USER_NOT_VERIFIED.toJSON());

    await removeUserByEmail(server, email);
    await app.close();
  });
  test("TIME_CAPSULE_FILE_NOT_EXISTS", async () => {
    const server = mockMailer(configureRoute(createServer()));
    const { email, accessToken } = await createVerifiedUserAndGetToken(server);
    const attachmentUrl = `${TIME_CAPSULE_BASE_URL}/uploads/something.that.does-not.exists.txt`;

    const subject = faker.lorem.words(5);
    const message = faker.lorem.sentences(2);
    const releasedAt = dayjs().add(7, "days");

    const app = http.createServer(server);
    const response = await request(app)
      .post("/v1/time-capsules")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + accessToken)
      .send({
        subject,
        message,
        attachmentUrl,
        releasedAt: releasedAt.toISOString(),
      });

    expect(response.status).toEqual(422);
    expect(response.body).toEqual(
      TIME_CAPSULE_ATTACHMENT_FILE_NOT_EXISTS.toJSON()
    );

    await removeUserByEmail(server, email);
    await app.close();
  });
});
