
const request = require("supertest");
const app = require("../app");

describe("Auth Endpoints", () => {
  it("should register a new user", async () => {
    const uniqueUsername = `testauthuser_${Date.now()}`; // guarantees uniqueness
    const res = await request(app).post("/api/auth/register").send({
      username: uniqueUsername,
      password: "testpass123"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should login the user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      username: "testauthuser",
      password: "testpass123"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
