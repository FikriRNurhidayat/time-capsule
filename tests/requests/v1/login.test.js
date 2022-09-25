const request = require("supertest");
const http = require("http");
const { faker } = require("@faker-js/faker");
const { mockMailer, removeUserByEmail } = require("../../utils");
const createServer = require("../../../src/createServer");
const configureRoute = require("../../../src/configureRoute");

describe("POST /v1/login", () => {
  test("OK", async () => {
    const server = mockMailer(configureRoute(createServer()));

    const email = faker.internet.email();
    const password = faker.internet.password();

    await server.registerService.call({ email, password });

    const app = http.createServer(server);
    const response = await request(app)
      .post("/v1/login")
      .set("Content-Type", "application/json")
      .send({ email, password });

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("accessToken");

    await removeUserByEmail(server, email);
    await app.close();
  });

  test("EMAIL_NOT_FOUND", async () => {
    const server = configureRoute(createServer());

    const email = faker.internet.email();
    const password = faker.internet.password();

    const app = http.createServer(server);
    const response = await request(app)
      .post("/v1/login")
      .set("Content-Type", "application/json")
      .send({ email, password });

    expect(response.status).toEqual(404);
    expect(response.body.error.reason).toEqual("EMAIL_NOT_FOUND");

    await app.close();
  });
});
