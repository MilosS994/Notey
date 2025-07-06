import request from "supertest";
import app from "../src/server.js";
import connectDB from "../src/config/db.js";
import mongoose from "mongoose";
import Note from "../src/models/note.model.js";
import User from "../src/models/user.model.js";

describe("Notes API", () => {
  let cookies;
  let userId;

  beforeAll(async () => {
    await connectDB(); // Connect to mongodb

    await User.deleteMany({});
    await Note.deleteMany({});

    const user = await User.create({
      email: "user@mail.com",
      password: "test1234",
      username: "User",
    });

    userId = user._id;

    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "user@mail.com", password: "test1234" });
    cookies = loginRes.headers["set-cookie"];
  });

  beforeEach(async () => {
    await Note.deleteMany({});
  });

  afterAll(async () => {
    await Note.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close(); //   Disconnect from mongodb when finished
  });

  //   Get notes
  it("should return notes if logged in", async () => {
    const res = await request(app).get("/api/v1/notes").set("Cookie", cookies);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Notes fetched successfully");
  });

  //   Create note
  it("should create a note if logged in", async () => {
    const res = await request(app)
      .post("/api/v1/notes")
      .set("Cookie", cookies)
      .send({
        title: "Buy beer",
        description: "Heineken perhaps?",
        priority: "high",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Note created successfully");
  });

  //   Check note validation when creating note if there is no title
  it("should return 400 if there is no valid title", async () => {
    const res = await request(app)
      .post("/api/v1/notes")
      .set("Cookie", cookies)
      .send({ description: "Tomorrow in the morning" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      "Title is required, must be at least 2 characters and less than 75 characters"
    );
  });

  //   Update note
  it("should update note if logged in", async () => {
    const noteRes = await request(app)
      .post("/api/v1/notes")
      .set("Cookie", cookies)
      .send({
        title: "Go play football",
        description: "Play football with friends tonight",
      });

    const noteId = noteRes.body.note._id;

    const res = await request(app)
      .patch(`/api/v1/notes/${noteId}`)
      .set("Cookie", cookies)
      .send({
        title: "Go play basketball",
        description: "Go play basketball with friends tonight",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.note.title).toBe("Go play basketball");
    expect(res.body.note.description).toBe(
      "Go play basketball with friends tonight"
    );
  });

  //   Get single note by ID
  it("should return a single note by ID if logged in", async () => {
    const noteRes = await request(app)
      .post("/api/v1/notes")
      .set("Cookie", cookies)
      .send({
        title: "Go play football",
        description: "Play football tonight with friends",
      });

    const noteId = noteRes.body.note._id;

    const res = await request(app)
      .get(`/api/v1/notes/${noteId}`)
      .set("Cookie", cookies);
    expect(res.statusCode).toBe(200);
    expect(res.body.note.title).toBe("Go play football");
    expect(res.body.note.description).toBe(
      "Play football tonight with friends"
    );
    expect(res.body.note._id).toBe(noteId.toString());
  });

  //   Delete note
  it("should delete existing note", async () => {
    const noteRes = await request(app)
      .post("/api/v1/notes")
      .set("Cookie", cookies)
      .send({
        title: "Go play tennis",
        description: "Play tennis with friends tonight",
      });

    const noteId = noteRes.body.note._id;

    const res = await request(app)
      .delete(`/api/v1/notes/${noteId}`)
      .set("Cookie", cookies);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Note deleted successfully");
  });

  //   Pin/unpin note
  it("should pin/unpin note", async () => {
    const noteRes = await request(app)
      .post("/api/v1/notes")
      .set("Cookie", cookies)
      .send({
        title: "Go play volleyball",
        description: "Play volleyball with friends tonight",
      });

    const noteId = noteRes.body.note._id;

    const resPin = await request(app)
      .patch(`/api/v1/notes/${noteId}/pin`)
      .set("Cookie", cookies);
    expect(resPin.statusCode).toBe(200);
    expect(resPin.body.note.isPinned).toBe(true);

    const resUnpin = await request(app)
      .patch(`/api/v1/notes/${noteId}/pin`)
      .set("Cookie", cookies);
    expect(resUnpin.statusCode).toBe(200);
    expect(resUnpin.body.note.isPinned).toBe(false);
  });

  //   Non authorized access without cookie
  it("should return 401 not authorized", async () => {
    const res = await request(app).get("/api/v1/notes");
    expect(res.statusCode).toBe(401);
  });

  //   Trying to access other user's note
  it("should not access other user's note", async () => {
    const user1 = await User.create({
      username: "user1",
      email: "user1@mail.com",
      password: "test1234",
    }); // Create first user

    const user2 = await User.create({
      username: "user2",
      email: "user2@mail.com",
      password: "test1234",
    }); // Create second user

    const loginResUser1 = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "user1@mail.com", password: "test1234" });
    const cookiesUser1 = loginResUser1.headers["set-cookie"]; // Login first user and set cookie

    const loginResUser2 = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "user2@mail.com", password: "test1234" });
    const cookiesUser2 = loginResUser2.headers["set-cookie"]; // Login second user and set cookie

    const noteRes = await request(app)
      .post("/api/v1/notes")
      .set("Cookie", cookiesUser1)
      .send({ title: "Buy beer" }); // Create note for user 1

    const noteId = noteRes.body.note._id; // Get note id from the note that user 1 created

    // Get other user's note
    const resGet = await request(app)
      .get(`/api/v1/notes/${noteId}`)
      .set("Cookie", cookiesUser2);
    expect(resGet.statusCode).toBe(404);

    // Delete other user's note
    const resDel = await request(app)
      .delete(`/api/v1/notes/${noteId}`)
      .set("Cookie", cookiesUser2);
    expect(resDel.statusCode).toBe(404);

    // Update other user's note
    const resUpdate = await request(app)
      .patch(`/api/v1/notes/${noteId}`)
      .set("Cookie", cookiesUser2)
      .send({ title: "Buy 2 beers" });
    expect(resUpdate.statusCode).toBe(404);
  });

  //   Sorting notes by priority
  it("should sort notes by priority", async () => {
    await request(app)
      .post("/api/v1/notes")
      .send({ title: "Note 1", priority: "medium" })
      .set("Cookie", cookies);

    await request(app)
      .post("/api/v1/notes")
      .send({ title: "Note 2", priority: "low" })
      .set("Cookie", cookies);

    await request(app)
      .post("/api/v1/notes")
      .send({ title: "Note 3", priority: "high" })
      .set("Cookie", cookies);

    const res = await request(app)
      .get("/api/v1/notes/sort/priority?order=desc")
      .set("Cookie", cookies);

    expect(res.statusCode).toBe(200);
    expect(res.body.notes.length).toBe(3);
    expect(res.body.notes[0].priority).toBe("high");
    expect(res.body.notes[1].priority).toBe("medium");
    expect(res.body.notes[2].priority).toBe("low");
  });

  //    Searching notes by text
  it("should return only notes that contain certain word", async () => {
    await request(app).post("/api/v1/notes").set("Cookie", cookies).send({
      title: "Go out with friends",
      description: "Visit museum and botanical garden",
    });

    await request(app).post("/api/v1/notes").set("Cookie", cookies).send({
      title: "Go out with family",
      description: "Have a dinner",
    });

    await request(app).post("/api/v1/notes").set("Cookie", cookies).send({
      title: "Play football with friends",
      description: "Meet them at 7pm",
    });

    const searchWord = "friends";

    const res = await request(app)
      .get(`/api/v1/notes/search?q=${searchWord}`)
      .set("Cookie", cookies);

    expect(res.statusCode).toBe(200);
    expect(res.body.notes.length).toBe(2);
    res.body.notes.forEach((note) => {
      expect(
        note.title.includes(searchWord) || note.description.includes(searchWord)
      ).toBe(true);
    });
  });

  //   Searching notes by priority
  it("should return only notes with given priority", async () => {
    await request(app).post("/api/v1/notes").set("Cookie", cookies).send({
      title: "Go out with friends",
      description: "Visit museum and botanical garden",
      priority: "high",
    });

    await request(app).post("/api/v1/notes").set("Cookie", cookies).send({
      title: "Go out with family",
      description: "Have a dinner",
      priority: "high",
    });

    await request(app).post("/api/v1/notes").set("Cookie", cookies).send({
      title: "Play football with friends",
      description: "Meet them at 7pm",
      priority: "medium",
    });

    await request(app).post("/api/v1/notes").set("Cookie", cookies).send({
      title: "Go shopping",
    });

    const searchedPriority = "high";

    const res = await request(app)
      .get(`/api/v1/notes/search?priority=${searchedPriority}`)
      .set("Cookie", cookies);
    expect(res.statusCode).toBe(200);
    expect(res.body.notes.length).toBe(2);
    res.body.notes.forEach((note) => {
      expect(note.priority).toBe(searchedPriority);
    });
  });

  //   Searching notes by pin
  it("should return only notes that are pinned", async () => {
    await request(app).post("/api/v1/notes").set("Cookie", cookies).send({
      title: "Go out with friends",
      description: "Visit museum and botanical garden",
      priority: "high",
      isPinned: true,
    });

    await request(app).post("/api/v1/notes").set("Cookie", cookies).send({
      title: "Go out with family",
      description: "Have a dinner",
      priority: "high",
    });

    await request(app).post("/api/v1/notes").set("Cookie", cookies).send({
      title: "Play football with friends",
      description: "Meet them at 7pm",
      priority: "medium",
      isPinned: true,
    });

    await request(app).post("/api/v1/notes").set("Cookie", cookies).send({
      title: "Go shopping",
    });

    const pinStatus = true;

    const res = await request(app)
      .get(`/api/v1/notes/search?isPinned=${pinStatus}`)
      .set("Cookie", cookies);
    expect(res.statusCode).toBe(200);
    expect(res.body.notes.length).toBe(2);
    res.body.notes.forEach((note) => {
      expect(note.isPinned).toBe(true);
    });
  });

  //   Searching notes multifield
  it("should return notes by requested order", async () => {
    await request(app).post("/api/v1/notes").set("Cookie", cookies).send({
      title: "Go out with friends",
      description: "Visit museum and botanical garden",
      priority: "high",
      isPinned: true,
    });

    await request(app).post("/api/v1/notes").set("Cookie", cookies).send({
      title: "Go out with family",
      description: "Have a dinner",
      priority: "high",
    });

    await request(app).post("/api/v1/notes").set("Cookie", cookies).send({
      title: "Play football with friends",
      description: "Meet them at 7pm",
      priority: "medium",
      isPinned: true,
    });

    await request(app).post("/api/v1/notes").set("Cookie", cookies).send({
      title: "Go shopping",
    });

    const res = await request(app)
      .get("/api/v1/notes/sort/multi")
      .set("Cookie", cookies);
    expect(res.statusCode).toBe(200);
    expect(res.body.notes.length).toBe(4);
    // Checking two pinned first
    expect(res.body.notes[0].isPinned).toBe(true);
    expect(res.body.notes[1].isPinned).toBe(true);

    // Checking priorities
    expect(res.body.notes[0].priority).toBe("high");
    expect(res.body.notes[1].priority).toBe("medium");

    // Then unpinned, then high priority and low priority
    expect(res.body.notes[2].isPinned).not.toBe(true);
    expect(res.body.notes[2].priority).toBe("high");

    expect(res.body.notes[3].isPinned).not.toBe(true);
    expect(res.body.notes[3].priority).toBe("low");
  });

  //   Searching by tags
  it("should return only notes with given tags", async () => {
    await request(app)
      .post("/api/v1/notes")
      .set("Cookie", cookies)
      .send({
        title: "Go out with friends",
        description: "Visit museum and botanical garden",
        priority: "high",
        isPinned: true,
        tags: ["fun", "friends"],
      });

    await request(app)
      .post("/api/v1/notes")
      .set("Cookie", cookies)
      .send({
        title: "Go out with family",
        description: "Have a dinner",
        priority: "high",
        tags: ["family", "weekend"],
      });

    await request(app)
      .post("/api/v1/notes")
      .set("Cookie", cookies)
      .send({
        title: "Play football with friends",
        description: "Meet them at 7pm",
        priority: "medium",
        isPinned: true,
        tags: ["friends"],
      });

    await request(app).post("/api/v1/notes").set("Cookie", cookies).send({
      title: "Go shopping",
    });

    const searchedTags = "friends";
    const tagArray = searchedTags.split(",");

    const res = await request(app)
      .get(`/api/v1/notes/search?tags=${searchedTags}`)
      .set("Cookie", cookies);
    expect(res.statusCode).toBe(200);
    expect(res.body.notes.length).toBe(2);
    res.body.notes.forEach((note) => {
      expect(note.tags.some((tag) => tagArray.includes(tag))).toBe(true);
    });
  });

  //   Seaching by more details
  it("should return notes with given details", async () => {
    await request(app)
      .post("/api/v1/notes")
      .set("Cookie", cookies)
      .send({
        title: "Go out with friends",
        description: "Visit museum and botanical garden",
        priority: "high",
        isPinned: true,
        tags: ["fun", "friends"],
      });

    await request(app)
      .post("/api/v1/notes")
      .set("Cookie", cookies)
      .send({
        title: "Go out with family",
        description: "Have a dinner",
        priority: "high",
        tags: ["family", "weekend"],
      });

    await request(app)
      .post("/api/v1/notes")
      .set("Cookie", cookies)
      .send({
        title: "Play football with friends",
        description: "Meet them at 7pm",
        priority: "medium",
        isPinned: true,
        tags: ["friends"],
      });

    await request(app).post("/api/v1/notes").set("Cookie", cookies).send({
      title: "Go shopping",
    });

    const searchedWord = "out";
    const priority = "high";

    const res = await request(app)
      .get(`/api/v1/notes/search?q=${searchedWord}&priority=${priority}`)
      .set("Cookie", cookies);
    expect(res.statusCode).toBe(200);
    expect(res.body.notes.length).toBe(2);
    res.body.notes.forEach((note) => {
      expect(
        note.title.includes(searchedWord) ||
          note.description.includes(searchedWord)
      ).toBe(true);
      expect(note.priority).toBe("high");
    });
  });

  //   Pagination testing
  it("should return correct notes for the requested page and limit", async () => {
    for (let i = 1; i <= 7; i++) {
      await request(app)
        .post("/api/v1/notes")
        .set("Cookie", cookies)
        .send({ title: `Note ${i}` });
    }

    const res = await request(app)
      .get("/api/v1/notes?page=2&limit=3")
      .set("Cookie", cookies);

    expect(res.statusCode).toBe(200);
    expect(res.body.notes.length).toBe(3);

    expect(res.body.notes[0].title).toBe("Note 4");
    expect(res.body.notes[1].title).toBe("Note 5");
    expect(res.body.notes[2].title).toBe("Note 6");

    expect(res.body.totalPages).toBe(3); // 7/3 = 2.33 -> 3 pages
    expect(res.body.totalNotes).toBe(7);
    expect(res.body.page).toBe(2);
  });
});
