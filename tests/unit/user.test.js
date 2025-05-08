const request = require("supertest");
const fastify = require("../../src/app");

describe("User API", () => {
  afterAll(async () => {
    await fastify.close();
  });

  it("should register a user and send verification code", async () => {
    const response = await request(fastify.server)
      .post("/api/users/register")
      .send({
        username: "testuser",
        email: "test@example.com",
      });

    expect(response.status).toBe(201);
    expect(response.body.meta.has_error).toBe(false);
    expect(response.body.data.message).toBe(
      "Verification code sent to your email"
    );
  });
});
