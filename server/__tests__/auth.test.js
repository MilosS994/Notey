import request from "supertest";
import app from "../src/server.js";
import connectDB from "../src/config/db.js";
import mongoose from "mongoose";
import User from "../src/models/user.model.js";

describe("User authentication", () => {
  let cookies;

  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  //   User registraion
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ username: "test", email: "test@mail.com", password: "test1234" });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User created successfully");
  });

  //   User registration email validation
  it("should not register if there is no email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ username: "test", password: "test1234" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  //   User registration username validation
  it("should not register if there is no email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "test@mail.com", password: "test1234" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  //   User registration password validation
  it("should not register if there is no email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ username: "test", email: "test@mail.com" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  //   Too short password validation
  it("should not register if password is too short", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "test@mail.com", username: "test", password: "test" });
    expect(res.statusCode).toBe(400);
  });

  //   Checking invalid email format
  it("should not register if email format is invalid", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "testmail.com", username: "test", password: "test1234" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid email format");
  });

  //   Case-insensitive email registration
  it("should register a new user", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      username: "test",
      email: "tESTt@maIl.coM",
      password: "test1234",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User created successfully");
  });

  //   User registraion if email already registered
  it("should reject registration if email already registered", async () => {
    await request(app)
      .post("/api/v1/auth/register")
      .send({ username: "test", email: "test@mail.com", password: "test1234" });

    const res = await request(app).post("/api/v1/auth/register").send({
      username: "test2",
      email: "test@mail.com",
      password: "test1234",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  //   User registration if username is already taken
  it("should reject registration if email already registered", async () => {
    await request(app)
      .post("/api/v1/auth/register")
      .send({ username: "test", email: "test@mail.com", password: "test1234" });

    const res = await request(app).post("/api/v1/auth/register").send({
      username: "test",
      email: "test2@mail.com",
      password: "test1234",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Username already taken");
  });

  //   User login
  it("should login a user if exists", async () => {
    await request(app)
      .post("/api/v1/auth/register")
      .send({ username: "test", email: "test@mail.com", password: "test1234" });

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@mail.com", password: "test1234" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User logged in successfully");
  });

  //   User login if user does not exist
  it("should not login a user if doesn't exist", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@mail.com", password: "test1234" });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  //   Invalid password login
  it("should not login a user if doesn't exist", async () => {
    await request(app)
      .post("/api/v1/auth/register")
      .send({ username: "test", email: "test@mail.com", password: "test1234" });

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@mail.com", password: "test12345" });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Invalid credentials");
  });

  //   User login email validation
  it("should not login if there is no email", async () => {
    await request(app)
      .post("/api/v1/auth/register")
      .send({ username: "test", email: "test@mail.com", password: "test1234" });

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ password: "test1234" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email and password are required");
  });

  // User login password validation
  it("should not login if there is no email", async () => {
    await request(app)
      .post("/api/v1/auth/register")
      .send({ username: "test", email: "test@mail.com", password: "test1234" });

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@mail.com" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email and password are required");
  });

  //   Get user info if logged in
  it("should retrieve user info if logged in", async () => {
    await request(app)
      .post("/api/v1/auth/register")
      .send({ username: "test", email: "test@mail.com", password: "test1234" });

    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@mail.com", password: "test1234" });
    cookies = loginRes.headers["set-cookie"];

    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", cookies);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User data fetched successfully");
  });

  //   Get user info if not logged in and there is no token
  it("should retrieve user info if logged in", async () => {
    await request(app)
      .post("/api/v1/auth/register")
      .send({ username: "test", email: "test@mail.com", password: "test1234" });

    const res = await request(app).get("/api/v1/auth/me");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("No token provided");
  });

  //   User logout
  it("should logout user", async () => {
    await request(app)
      .post("/api/v1/auth/register")
      .send({ username: "test", email: "test@mail.com", password: "test1234" });

    await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@mail.com", password: "test1234" });

    const res = await request(app).post("/api/v1/auth/logout");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User logged out successfully");
  });
});
