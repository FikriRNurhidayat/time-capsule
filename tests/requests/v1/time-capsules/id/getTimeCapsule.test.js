const request = require("supertest");
const http = require("http");
const { faker } = require("@faker-js/faker");
const dayjs = require("dayjs");
const { TIME_CAPSULE_INACTIVE } = require("../../../../../src/errors");
const createServer = require("../../../../../src/createServer");
const configureRoute = require("../../../../../src/configureRoute");
const {
  mockMailer,
  createVerifiedUserAndGetToken,
  createFileURL,
  createUserAndGetToken,
  createTimeCapsule,
  removeUserByEmail,
  removeTimeCapsule,
} = require("../../../../utils");

describe("GET /v1/time-capsules/:id", () => {
  test("OK", async () => {
    const server = mockMailer(configureRoute(createServer()));
    const {
      id: userId,
      email,
      accessToken,
    } = await createVerifiedUserAndGetToken(server);
    const attachmentUrl = await createFileURL();

    const subject = faker.lorem.words(5);
    const message = faker.lorem.sentences(2);
    const releasedAt = dayjs().subtract(7, "days");

    const { id } = await createTimeCapsule(server, {
      subject,
      message,
      active: true,
      attachmentUrl,
      userId,
      releasedAt,
    });

    const app = http.createServer(server);
    const response = await request(app)
      .get("/v1/time-capsules/" + id)
      .set("Authorization", "Bearer " + accessToken);

    expect(response.status).toEqual(200);
    expect(response.body.timeCapsule).toEqual({
      id: expect.any(String),
      subject,
      message,
      active: true,
      attachmentUrl,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      releasedAt: releasedAt.toISOString(),
    });

    await removeTimeCapsule(server, response.body.timeCapsule.id);
    await removeUserByEmail(server, email);
    await app.close();
  });

  test("TIME_CAPSULE_INACTIVE", async () => {
    const server = mockMailer(configureRoute(createServer()));
    const {
      id: userId,
      email,
      accessToken,
    } = await createVerifiedUserAndGetToken(server);
    const attachmentUrl = await createFileURL();

    const subject = faker.lorem.words(5);
    const message = faker.lorem.sentences(2);
    const releasedAt = dayjs().subtract(7, "days");

    const { id } = await createTimeCapsule(server, {
      subject,
      message,
      attachmentUrl,
      userId,
      releasedAt,
    });

    const app = http.createServer(server);
    const response = await request(app)
      .get("/v1/time-capsules/" + id)
      .set("Authorization", "Bearer " + accessToken);

    expect(response.status).toEqual(422);
    expect(response.body).toEqual(TIME_CAPSULE_INACTIVE.toJSON());

    await removeTimeCapsule(server, id);
    await removeUserByEmail(server, email);
    await app.close();
  });
});
