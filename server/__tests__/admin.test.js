import request from "supertest";
import app from "../src/server.js";
import connectDB from "../src/config/db.js";
import mongoose from "mongoose";
import User from "../src/models/user.model.js";
import Note from "../src/models/note.model.js";

describe("Admin routes", () => {
  let adminCookies;
  let userCookies;
  let adminUser;
  let normalUser;

  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    // Clear db
    await User.deleteMany({});
    await Note.deleteMany({});

    // Create admin user
    adminUser = await User.create({
      username: "admin",
      email: "admin@mail.com",
      password: "admin1234",
      isAdmin: true,
    });

    // Create regular user
    normalUser = await User.create({
      username: "user",
      email: "user@mail.com",
      password: "user1234",
      isAdmin: false,
    });

    // Create admin note
    await Note.create({
      title: "Admin note",
      description: "Just an admin note",
      author: adminUser._id,
    });

    // Create user note
    await Note.create({
      title: "User note",
      description: "Just a user note",
      author: normalUser._id,
    });

    // Admin login
    const adminLogin = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@mail.com", password: "admin1234" });
    adminCookies = adminLogin.headers["set-cookie"];

    // Regular user login
    const userLogin = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "user@mail.com", password: "user1234" });
    userCookies = userLogin.headers["set-cookie"];
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Admin should be able to delete any user
  it("should allow admin to delete any user", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/users/${normalUser._id}`)
      .set("Cookie", adminCookies);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User deleted successfully");
    // Check if user was deleted for sure
    const user = await User.findById(normalUser._id);
    expect(user).toBeNull();
  });

  // Should return error 404 if user to delete do not exist
  it("should return 404 for non-existent user delete", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/v1/admin/users/${fakeId}`)
      .set("Cookie", adminCookies);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  // Testing if regular users can somehow delete any user (they shouldn't)
  it("should not allow regular users to delete other user", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/users/${adminUser._id}`)
      .set("Cookie", userCookies);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Access forbidden: Admins only");
  });

  // Testing if admins can get all users list with their notes included
  it("should get all users with their notes for admin", async () => {
    const res = await request(app)
      .get("/api/v1/admin/users")
      .set("Cookie", adminCookies);

    expect(res.statusCode).toBe(200);
    expect(res.body.users.length).toBeGreaterThanOrEqual(2);
    res.body.users.forEach((user) => {
      expect(user).toHaveProperty("notes");
    });
  });

  // Testing for unauthenticated access
  it("should not allow unauthenticated access", async () => {
    const res = await request(app).get("/api/v1/admin/users");
    expect(res.statusCode).toBe(401);
  });
});
