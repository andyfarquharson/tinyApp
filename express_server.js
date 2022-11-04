const express = require("express");
const app = express();
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs')
const morgan = require('morgan');
const PORT = 8080; // default port 8080
const {generateRandomString, getURLsByUserID, getUserbyID, getUserByEmail} = require("./helpers");

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({name: "session", keys: ["soybean"]}));
app.use(morgan('dev'));
// Function used to get short URL and username

// const urlDatabase = {
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    user_id: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    user_id: "aJ48lW",
  },
};

// User
const users = {};
// const users = {
//   userRandomID: {
//     id: "userRandomID",
//     email: "user@example.com",
//     password: "pmd",
//   },
//   bcplu4: {
//     id: "bcplu4",
//     email: "user2@example.com",
//     password: "dishwasher-funk",
//   },
//   aJ48lW: {
//     id: "aJ48lW",
//     email: "a@b.com",
//     password: "123"
//   }
// };
// Homepage
app.get("/", (req, res) => {
  
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.get("/urls", (req, res) => {
  const name = req.session.user_id;
  console.log(getURLsByUserID(name, urlDatabase))
  if (name) {
  const templateVars = {
    urls: getURLsByUserID(name, urlDatabase),
    user: users[name]
  };
  res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
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
  const shortURL = req.params.shortURL
  console.log(urlDatabase[shortURL].longURL)
  const templateVars = {
      urls: urlDatabase,
      shortURL: req.params.shortURL,
      longURL: urlDatabase[shortURL].longURL,
      user: users[req.session.user_id]

    };
    res.render("urls_show", templateVars);
  });
  
app.get("/u/:shortURL", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[shortURL].longURL,
    user: users[req.session.user_id]
  };
  res.redirect("longUrl", templateVars);
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
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400).send('400 Error: Must contain correct email or password');
  } else {
    req.session.user_id = name;
    const hashPassword = bcrypt.hashSync(password, 10)
    users[name] = {
      name,
      email,
      password: hashPassword
    }
    };
  res.redirect("/urls");
})

// Login with username
app.get("/login", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls")
  } else {
  const templateVars = {
    user: users[req.session.user_id]
  };  
  res.render("urls_login", templateVars);
  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const pw = req.body.password;
  const name = getUserByEmail(email, users);
  if (!email || !pw) {
    res.status(400).send('400 Error: Must contain correct email or password');
  }
  if (name === null) {
    return res.status(400).send('400 Error: No user found with that email!');
    }
  if (!bcrypt.compareSync(pw, name.password)) {
    return res.status(400).send('400 Error: Username or password incorrect! Please try again!')
  } else {
    req.session.user_id = name.name;
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
  const longURL = req.body.updatedURL
  const user_id = req.session.user_id
  urlDatabase[shortURL] = {longURL, user_id};
  console.log(urlDatabase[shortURL])
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL
  const user_id = req.session.user_id
  urlDatabase[shortURL] = {longURL, user_id};
  if (req.session.user_id) {
  res.redirect(`/urls/${shortURL}`);
  } else {
  res.status(400).send('400 Error: Must be logged in to save urls');
  }
});
// Logout post
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
// 404 error page not found
app.get("*", (req, res) => {
  res.status(404).send('404 Error: Page not found!');
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


