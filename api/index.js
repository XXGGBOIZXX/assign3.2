import bodyParser from "body-parser";
import express from "express";
import { MongoClient } from "mongodb";

const api = new express.Router();
let users;
let posts;
const initApi = async (app) => {
  app.set("json spaces", 2);
  app.use("/api", api);
  let conn = await MongoClient.connect("mongodb://127.0.0.1");
  let db = conn.db("assign3");

  users = db.collection("users");
  posts = db.collection("posts");

};

api.use(bodyParser.json());

//GET/

api.get("/", (req, res) => {
  res.json({ db: "local_api", numUsers: 1, numPosts: 1 });
});

// GET /users
api.get('/users', async (req, res) => {
  const allUsers = await users.find({}).toArray(); 
  res.send({ users: allUsers.map((user) => user.id) });
});

// GET /users/:id
api.get('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const user = await users.findOne({ id: userId }); 
  if (!user) {
    return res.status(404).send({ error: "No user with ID " + userId });
  }
  res.send(user);
});

// POST /users 
api.post('/users', async (req, res) => {
  const newUserId = req.body.id;

  if (!newUserId || newUserId.trim() === "") {
    return res.status(400).send({ error: "User ID is missing or empty" });
  }
  const existingUser = await users.findOne({ id: newUserId });
  if (existingUser) {
    return res.status(400).send({ error: "User ID already exists" });
  }

  const newUser = {
    id: newUserId,
    name: newUserId, 
    avatarURL: "images/default.png",
    following: [],
  };
  await users.insertOne(newUser); 
  res.send(newUser);
});

// PATCH /users/:id
api.patch('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const update = { $set: req.body };
  const result = await users.updateOne({ id: userId }, update);
  if (result.matchedCount === 0) {
    return res.status(404).send({ error: "No user with ID " + userId });
  }
  const updatedUser = await users.findOne({ id: userId }); 
  res.send(updatedUser);
});

// GET /users/:id/feed
api.get('/users/:id/feed', async (req, res) => {
  const userId = req.params.id;
  const user = await users.findOne({ id: userId });
  if (!user) {
    return res.status(404).send({ error: "No user with ID " + userId });
  }
  const followingPosts = await posts.find({ userId: { $in: [...user.following, userId] } }).sort({ time: -1 }).toArray();
  const formattedPosts = [];
    for (const post of followingPosts) {
      const postUser = await users.findOne({ id: post.userId });
      if (postUser) {
        formattedPosts.push({
          user: {
            id: postUser.id,
            name: postUser.name,
            avatarURL: postUser.avatarURL
          },
          time: post.time,
          text: post.text
        });
      }
    }
    
    // Send the response with posts including user information
    res.send({ posts: formattedPosts });
});

// POST /users/:id/posts
api.post('/users/:id/posts', async (req, res) => {
  const userId = req.params.id;
  const user = await users.findOne({ id: userId });
  if (!user) {
    return res.status(404).send({ error: "No user with ID " + userId });
  }
  if (!req.body.text || req.body.text.trim() === "") {
    return res.status(400).send({ error: "Post text is missing or empty" });
  }
  const newPost = {
    userId,
    time: new Date(),
    text: req.body.text,
  };
  await posts.insertOne(newPost); 
  res.send({ success: true });
});

// POST /users/:id/follow
api.post('/users/:id/follow', async (req, res) => {
  const userId = req.params.id;
  const targetId = req.query.target;

  if (!userId || !targetId) {
    return res.status(400).send({ error: "Missing user ID or target ID" });
  }

  const user = await users.findOne({ id: userId });
  const targetUser = await users.findOne({ id: targetId });

  if (!user || !targetUser) {
    return res.status(404).send({ error: "User or target user not found" });
  }

  if (userId === targetId) {
    return res.status(400).send({ error: "Cannot follow yourself" });
  }

  if (user.following.includes(targetId)) {
    return res.status(400).send({ error: "Already following this user" });
  }

  const update = { $push: { following: targetId } }; 
  await users.updateOne({ id: userId }, update);

  res.send({ success: true });
});

// DELETE /users/:id/follow
api.delete('/users/:id/follow', async (req, res) => {
    const userId = req.params.id;
    const targetId = req.query.target;

    if (!userId || !targetId) {
      return res.status(400).send({ error: "Missing user ID or target ID" });
    }

    const user = await users.findOne({ id: userId });
    const targetUser = await users.findOne({ id: targetId });

    if (!user || !targetUser) {
      return res.status(404).send({ error: "User or target user not found" });
    }

    const followingIndex = user.following.indexOf(targetId);
    if (followingIndex === -1) {
      return res.status(400).send({ error: "Not following this user" });
    }

    const update = { $pull: { following: targetId } }; // Remove target ID from following list
    await users.updateOne({ id: userId }, update);

    res.send({ success: true });
  });

 
/* This is a catch-all route that logs any requests that weren't handled above.
   Useful for seeing whether other requests are coming through correctly */
api.all("/*", (req, res) => {
  let data = {
    method: req.method,
    path: req.url,
    query: req.query,
    body: req.body
  };
  console.log(data);
  res.status(500).json({ error: "Not implemented" });
});

export default initApi;
