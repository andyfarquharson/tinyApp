const express = require("express");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const morgan = require('morgan');
const {generateRandomString, getURLsByUserID, getUserbyID, getUserByEmail, emailInUse} = require("./helpers");

const app = express();
const PORT = 8080; // default port 8080
// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({name: "session", keys: ["soybean"]}));
app.use(morgan('dev'));

// const urlDatabase = {
const urlDatabase = {};
// User
const users = {};

// Homepage
app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});
//
app.get("/urls", (req, res) => {
  const name = req.session.user_id;
  if (name) {
    const templateVars = {
      urls: getURLsByUserID(name, urlDatabase),
      user: users[name]
    };
    res.render("urls_index", templateVars);
  } else {
    return res.status(400).send('400 Error: Must be logged in!');
  }
});
// Form to get a new url
app.get("/urls/new", (req, res) => {
  const name = req.session.user_id;
  const user = getUserbyID(name, users);
  const templateVars = {
    urls: urlDatabase,
    longURL: req.body.longURL,
    user: users[name]
  };
  if (!user) {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  }
});

  app.get("/urls/:shortURL", (req, res) => {
  const name = req.session.user_id;
  let templateVars = {};
  if (!name) {
    return res.status(400).send('400 Error: Must be logged in with correct user!');
  } else {
    const userURLs = getURLsByUserID(name, urlDatabase);
    const {shortURL} = req.params;
    if (userURLs[shortURL]) {
      const longURL = userURLs[shortURL].longURL;
      templateVars.user = users[name];
      templateVars.longURL = longURL;
      templateVars.shortURL = shortURL;
    } else {
      return res.status(400).send('400 Error: Must be logged in with correct user and have correct url!');
    }
  }
  res.render("urls_show", templateVars);
});
  
app.get("/u/:shortURL", (req, res) => {
  const {shortURL} = req.params;
  if (urlDatabase[shortURL]) {
    return res.redirect(urlDatabase[shortURL].longURL);
  } 
  return res.status(400).send('400 Error: This link does not exist!');
});

// registration
app.get("/registration", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    const templateVars = {
      user: users[req.session.user_id]
    };
    res.render("urls_registration", templateVars);
  }
});

app.post("/registration", (req, res) => {
  const name = generateRandomString();
  const {email} = req.body;
  const {password} = req.body;
  if (!email || !password || emailInUse(email, users)) {
    return res.status(400).send('400 Error: Must contain correct email or password');
  } else {
    req.session.user_id = name;
    const hashPassword = bcrypt.hashSync(password, 10);
    users[name] = {
      name,
      email,
      password: hashPassword
    };
  }
  res.redirect("/urls");
});

// Login with username
app.get("/login", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    const templateVars = {
      user: users[req.session.user_id]
    };
    res.render("urls_login", templateVars);
  }
});

app.post("/login", (req, res) => {
  const {email} = req.body;
  const pw = req.body.password;
  const user = getUserByEmail(email, users);
  if (!email || !pw) {
    return res.status(400).send('400 Error: Must contain correct email or password');
  }
  if (!user) {
    return res.status(400).send('400 Error: No user found with that email!');
  }
  if (!bcrypt.compareSync(pw, user.password)) {
    return res.status(400).send('400 Error: Username or password incorrect! Please try again!');
  } else {
    req.session.user_id = user.name;
    res.redirect("/urls");
  }
});

// Deletes url from database
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// Updates url in the database
app.post("/urls/:shortURL/", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.updatedURL;
  const user_id = req.session.user_id;
  urlDatabase[shortURL] = {longURL, user_id};
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const {longURL} = req.body;
  const user_id = req.session.user_id;
  urlDatabase[shortURL] = {longURL, user_id};
  if (!user_id) {
    return res.status(400).send('400 Error: Must be logged in to save urls');
  } else {
    res.redirect(`/urls/${shortURL}`);
  }
});
// Logout post
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

// 404 error page not found
app.get("*", (req, res) => {
  return res.status(404).send('404 Error: Page not found!');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


