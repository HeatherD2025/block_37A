
const request = require("supertest");
const app = require("../app");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNiN2JkYmU4LWQ1ZGMtNGMzNy04OGU1LTE3ZGNkYjZhYTAzNSIsInVzZXJuYW1lIjoidGVzdHVzZXIxIiwiaWF0IjoxNzQ1OTg5NDMxfQ.OnaqbO312IW_2RzjoGIIySFwhi2TJ4ApUFAVYHeGRxY";
const userId = "3b7bdbe8-d5dc-4c37-88e5-17dcdb6aa035";
const reviewId = "8501e65b-5d89-4bc2-9eb3-44c08691ab51";

describe("Comment Endpoints", () => {
  it("should post a comment", async () => {
    const res = await request(app)
      .post(`/api/items/cce5768e-e71d-40da-be27-82f9f652bb91/reviews/${reviewId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "🔥 fire sandwich",
        userId
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("text");
  });
});
