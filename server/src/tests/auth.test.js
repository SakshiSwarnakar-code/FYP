import request from "supertest";
import app from "../app.js";
import { connectDB, disconnectDB } from "./db.js";

const TEST_EMAIL = "testuser_fixed@gmail.com";
const TEST_PASSWORD = "Test1234";

describe("Auth API", () => {
  beforeAll(async () => {
    await connectDB();

    await request(app)
      .post("/api/auth/register/volunteer")
      .field("firstName", "Test")
      .field("lastName", "User")
      .field("phoneNumber", "9800000001")
      .field("email", TEST_EMAIL)
      .field("password", TEST_PASSWORD);
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it("should register a new volunteer", async () => {
    const ts = Date.now();
    const res = await request(app)
      .post("/api/auth/register/volunteer")
      .field("firstName", "Test")
      .field("lastName", "User")
      .field("phoneNumber", `98${ts.toString().slice(-8)}`)
      .field("email", `testuser_${ts}@gmail.com`)
      .field("password", TEST_PASSWORD);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data).toHaveProperty("email");
  });

  it("should login user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("accessToken");
    expect(res.body.data).toHaveProperty("refreshToken");
  });

  it("should fail login with wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: TEST_EMAIL,
      password: "Wrongpass1",
    });

    expect(res.statusCode).toBe(401);
  });
});
