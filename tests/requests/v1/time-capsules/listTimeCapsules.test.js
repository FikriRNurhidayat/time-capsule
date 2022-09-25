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
  createFileURL,
  createTimeCapsule,
  createUserAndGetToken,
  createVerifiedUserAndGetToken,
  removeUserByEmail,
  removeTimeCapsule,
} = require("../../../utils");
const createServer = require("../../../../src/createServer");
const configureRoute = require("../../../../src/configureRoute");

describe("POST /v1/time-capsules", () => {
  test("OK", async () => {
    const server = mockMailer(configureRoute(createServer()));

    const {
      id: userId,
      email,
      accessToken,
    } = await createVerifiedUserAndGetToken(server);
    const subject = faker.lorem.words(5);
    const message = faker.lorem.sentences(2);
    const releasedAt = dayjs().add(7, "days");

    const timeCapsule = await createTimeCapsule(server, {
      subject,
      message,
      releasedAt,
      userId,
    });

    const app = http.createServer(server);

    const response = await request(app)
      .get("/v1/time-capsules")
      .set("Authorization", "Bearer " + accessToken);

    expect(response.status).toEqual(200);
    expect(response.body.timeCapsules).toContainEqual({
      id: timeCapsule.id,
      subject: timeCapsule.subject,
      active: timeCapsule.active,
      createdAt: timeCapsule.createdAt.toISOString(),
      updatedAt: timeCapsule.updatedAt.toISOString(),
      releasedAt: timeCapsule.releasedAt.toISOString(),
    });

    await removeTimeCapsule(server, timeCapsule.id);
    await removeUserByEmail(server, email);

    await app.close();
  });
});
