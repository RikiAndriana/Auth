const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const session = require("express-session");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "its-secret",
    resave: false,
    saveUninitialized: "false",
  })
);

const auth = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  next();
};

const authenticated = (req, res, next) => {
  if (!req.session.user_id) {
    return next();
  }
  res.redirect("/admin");
};

mongoose
  .connect("mongodb://127.0.0.1/demo-auth")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log("app listenging on port http://localhost:3000");
});

app.get("/", auth, (req, res) => {
  console.log(req.session);

  res.send("Homepage");
});

app.get("/admin", auth, (req, res) => {
  res.render("admin");
});

app.get("/register", authenticated, (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = new User({
    username,
    password,
  });
  await user.save();
  req.session.user_id = user._id;
  res.redirect("/");
});

app.get("/login", authenticated, (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findByCredentials(username, password);

  if (user) {
    req.session.user_id = user._id;
    res.redirect("/admin");
  } else {
    res.redirect("/register");
  }
});

app.post("/logout", auth, (req, res) => {
  // req.session.user_id = null;
  req.session.destroy(() => {
    res.redirect("/login");
  });
});
