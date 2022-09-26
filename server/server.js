const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const User = require("./models/User");
const Piary = require("./models/Piary");
const Entry = require("./models/Entry");

require("dotenv").config({ path: "./config.env" });

const PORT = process.env.PORT || 5000;

mongoose.connect("mongodb://localhost/mongodb");

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "piaries are better than diaries",
    resave: true,
    saveUninitialized: true,
  })
);

app.get("/logged-in", (req, res) => {
  if (req.session.user === undefined) {
    res.send({ successful: false, message: "User not in session" });
  } else res.send({ successful: true, message: "User is logged in" });
});

app.get("/get-user", (req, res) => {
  if (req.session.user === undefined) {
    res.send({ successful: false, message: "User not in session" });
  }

  res.send({
    successful: true,
    message: "User is logged in",
    data: req.session.user,
  });
});

app.post("/logout", (req, res) => {
  if (req.session.user === undefined) {
    res.send({ successful: false, message: "User is not logged in" });
  } else {
    delete req.session.user;
    res.send({ successful: true, message: "Successfuly logged out" });
  }
});

app.post("/login", async (req, res) => {
  // finds users with given username and email
  const username = await User.findOne({ username: req.body.username });
  const email = await User.findOne({ email: req.body.email });

  // checks if password matches
  if (
    (username && (await username.validatePassword(req.body.password))) ||
    (email && (await email.validatePassword(req.body.password)))
  ) {
    // adds user to session
    req.session.user = req.body.username;
    req.session.save();
    res.send({ successful: true, message: "Successfully logged in" });
  } else {
    res.send({ successful: false, message: "Invalid username or password" });
  }
});

app.get("/entries", async (req, res) => {
  const user = await User.findOne({ username: req.session.user }).populate(
    "piary"
  );
  const piary = await user.piary.populate("entries");
  const entries = piary.entries;
  res.send(entries);
});

app.get("/entry", async (req, res) => {
  const user = await User.findOne({ username: req.session.user }).populate(
    "piary"
  );
  const piary = await user.piary.populate("entries");
  for (const entry of piary.entries) {
    if (entry.id == req.query.entryID) {
      res.send(entry.pages);
      return;
    }
  }
  res.send([]);
});

app.post("/new-entry", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.session.user }).populate(
      "piary"
    );
    const entry = new Entry({ date: req.body.date });
    for (const page of req.body.pages) entry.pages.push(page);
    entry.save();
    const piary = await user.piary.populate("entries");
    piary.entries.push(entry);
    piary.save();
    user.save();
    res.send({ successful: true, message: "Successfully saved entry" });
  } catch (e) {
    console.log(e);
    res.send({ successful: false, message: "Failed to save entry" });
  }
});

app.post("/register", async (req, res) => {
  const usernameFound = await User.findOne({ username: req.body.username });
  const emailFound = await User.findOne({ email: req.body.email });

  if (usernameFound !== null) {
    res.send({
      successful: false,
      message: `User with username "${req.body.username}" already exists`,
    });
    return;
  }

  if (emailFound !== null) {
    res.send({
      successful: false,
      message: `User with email "${req.body.email}" already exists`,
    });
    return;
  }

  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const piary = new Piary({});
    user.piary = piary;
    piary.save();
    user.save();
  } catch (e) {
    console.log(e);
  }

  res.send({
    successful: true,
    message: "Successfully registered",
  });
});

app.listen(PORT);
