import request from "supertest";
import app from "../app.js";
import { connectDB, disconnectDB } from "./db.js";

describe("Campaign API", () => {
  let token;
  let userId;

  beforeAll(async () => {
    await connectDB();

    const ts = Date.now();
    const email = `campaignuser_${ts}@gmail.com`;
    const phone = `98${ts.toString().slice(-8)}`;

    const registerRes = await request(app)
      .post("/api/auth/register/volunteer")
      .field("firstName", "Campaign")
      .field("lastName", "Tester")
      .field("phoneNumber", phone)
      .field("email", email)
      .field("password", "Test1234");

    const loginRes = await request(app).post("/api/auth/login").send({
      email,
      password: "Test1234",
    });

    token = loginRes.body?.data?.accessToken;
    userId = loginRes.body?.data?.id;
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it("should create a campaign", async () => {
    expect(token).toBeDefined();
    expect(userId).toBeDefined();

    const res = await request(app)
      .post("/api/campaign")
      .set("Authorization", `Bearer ${token}`)
      .field("title", "Tree Plantation")
      .field("description", "Plant trees in community")
      .field("location", "Kathmandu")
      .field("category", "Environment")
      .field("startDate", "2025-08-01")
      .field("endDate", "2025-08-30")
      .field("createdBy", userId);

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("title", "Tree Plantation");
  });
});
