
const request = require("supertest");
const app = require("../app");

let itemId = "cce5768e-e71d-40da-be27-82f9f652bb91";
let reviewId = "8501e65b-5d89-4bc2-9eb3-44c08691ab51";
let userId = "3b7bdbe8-d5dc-4c37-88e5-17dcdb6aa035";
let token = "";

beforeAll(async () => {
    const res = await request(app).post("/api/auth/login").send({
      username: "testuser1",
      password: "password1"
    });
    token = res.body.token;
  });
  
  describe("Review Endpoints", () => {
    test("GET /api/items - should return all items", async () => {
      const res = await request(app).get("/api/items");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.item)).toBe(true);
    });
  
    test("GET /api/items/:itemId - should return item", async () => {
      const res = await request(app).get(`/api/items/${itemId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.item).toHaveProperty("id", itemId);
    });
  
    test("POST /api/items/:itemId/reviews - create review", async () => {
      const res = await request(app)
        .post(`/api/items/${itemId}/reviews`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          rating: 5,
          text: "Actually bomb as hell",
          userId
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("text");
      reviewId = res.body.id;
    });
  
    test("GET /api/items/:itemId/reviews", async () => {
      const res = await request(app).get(`/api/items/${itemId}/reviews`);
      expect(res.statusCode).toBe(200);
    });
  
    test("GET /api/items/:itemId/review/:reviewId", async () => {
      const res = await request(app).get(`/api/items/${itemId}/review/${reviewId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("id", reviewId);
    });
  
    test("GET /api/reviews/me", async () => {
      const res = await request(app)
        .get("/api/reviews/me")
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
    });
  
    test("PUT /api/users/:userId/reviews/:reviewId", async () => {
      const res = await request(app)
        .put(`/api/users/${userId}/reviews/${reviewId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          rating: 4,
          comments: "Updated comment from test suite"
        });
      expect(res.statusCode).toBe(200);
    });
  
    test("DELETE /api/users/:userId/reviews/:reviewId", async () => {
      const res = await request(app)
        .delete(`/api/users/${userId}/reviews/${reviewId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(204);
    });
  });
  
