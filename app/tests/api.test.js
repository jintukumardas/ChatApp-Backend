// Tests for the APIs
const chai = require("chai");
const { expect } = chai;
const supertest = require("supertest");
const app = require("../../server");
const { connectToDatabase } = require("../db");
const User = require("../models/user");
const Group = require("../models/group");
const Message = require("../models/message");
const request = supertest.agent(app);
const { v4: uuidv4 } = require("uuid");

// Admin APIs tests
describe("Admin APIs", function () {
  this.timeout(5000);

  // test new user creation
  it("should create a new user", async () => {
    const response = await request.post("/admin/users").send({
      username: `admin-${uuidv4()}`, // Generate a unique username
      password: "password1",
      role: "admin",
    });

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("_id");
    expect(response.body.role).to.equal("admin");
  });

  // test update user details
  it("should update an existing user", async () => {
    const newUser = await User.create({
      username: `user-${uuidv4()}`, // Generate a unique username
      password: "password1",
    });

    let userId = await newUser._id.toString();
    let newUsername = await `updated-user-${uuidv4()}`;
    const response = await request.put(`/admin/users/${userId}`).send({
      username: `${newUsername}`,
    });
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("_id");
    expect(response.body.username).to.equal(`${newUsername}`);
  });
});

// Authentication APIs tests
describe("Authentication APIs", () => {
  let user;
  before(async () => {
    user = await User.create({
      username: `user-${uuidv4()}`, // Generate a unique username
      password: "password1",
    });
  });

  // test user login
  it("should log in a user with valid credentials", async () => {
    const response = await request.post("/auth/login").send({
      username: user.username,
      password: "password1",
    });

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("Login successful");
  });

  // test user logout
  it("should log out a logged-in user", async () => {
    const response = await request.post("/auth/logout");

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("Logout successful");
  });
});

// Message APIs tests
describe("Message APIs", () => {
  let user;
  let group;

  before(async () => {
    user = await User.create({
      username: `user-${uuidv4()}`, // Generate a unique username
      password: "password1",
    });

    let userId = await user._id.toString();
    let newGroupName = await `group-${uuidv4()}`;
    group = await Group.create({
      name: `${newGroupName}`,
      members: [userId],
    });
  });

  // test sending a message
  it("should send a message in a group", async () => {
    const response = await request.post("/messages/messages").send({
      groupId: group._id.toString(),
      senderId: user._id.toString(),
      content: "Hello, group!",
    });

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("_id");
    expect(response.body.groupId).to.equal(group._id.toString());
    expect(response.body.senderId).to.equal(user._id.toString());
    expect(response.body.content).to.equal("Hello, group!");
  });

  // test liking a messages in a group
  it("should like a message", async () => {
    const message = await Message.create({
      groupId: group._id.toString(),
      senderId: user._id.toString(),
      content: "Hello, group!",
    });

    const response = await request
      .post(`/messages/messages/${message._id.toString()}/like`)
      .send({
        userId: user._id.toString(),
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("_id");
    expect(response.body.likes)
      .to.be.an("array")
      .that.includes(user._id.toString());
  });
});

// Group APIs tests
describe("Group API", () => {
  var testGroup = `group-${uuidv4()}`;
  var testUser = `user-${uuidv4()}`;
  let user;
  let group;

  before(async () => {
    user = await User.create({
      username: testUser, // Generate a unique username
      password: "password1",
    });
  });

  // test creating a new group
  it("should create a new group", async () => {
    const response = await request
      .post("/groups/groups")
      .send({ name: testGroup });
    group = response.body;
    expect(response.statusCode).to.equal(201);
    expect(response.body.name).to.equal(testGroup);
  });

  // test adding a member to a group
  it("should add a member to a group", async () => {
    const response = await request
      .post(`/groups/groups/${group._id.toString()}/members`)
      .send({ userId: user._id.toString() });
    expect(response.statusCode).to.equal(200);
    expect(response.body.message).to.equal("Member added successfully");
  });

  // test searching group member
  it("should search for group members", async () => {
    const response = await request.get(
      `/groups/groups/${group._id.toString()}/members/search/${user._id.toString()}`
    );
    expect(response.statusCode).to.equal(200);
    expect(response.body.message).to.equal("Member of the group");
  });

  // test deleting a group
  it("should delete an existing group", async () => {
    const response = await request.delete(
      `/groups/groups/${group._id.toString()}`
    );
    expect(response.statusCode).to.equal(200);
    expect(response.body.message).to.equal("Group deleted successfully");
  });
});
