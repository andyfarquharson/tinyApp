const express = require("express");
const app = express();
const cookieSession = require('cookie-session');
const morgan = require('morgan');
const PORT = 8080; // default port 8080

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({name: "session", keys: ["soybean"]}));
app.use(morgan('dev'));
// Function used to get short URL and username
function generateRandomString() {
  const result = Math.random().toString(36).substring(2,8);
  return result;
}
//
const getUserByEmail = (email, users) => {
  for (const key in users) {
    const user = users[key];
    if (email === user.email) {
      return user;
    }
  }
  return null;
};
// 
const getUserbyID = (name, users) => {
  const user = users[name];
  if (user) {
    return user;
  }
  return null;
}
// const urlDatabase = {
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    name: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    name: "aJ48lW",
  },
};

// User
const users = {
  Random: {
    name: "userRandomID",
    email: "user@example.com",
    password: "pmd",
  },
  bcplu4: {
    name: "bcplu4",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
  aJ48lW: {
    name: "aJ48lW",
    email: "a@b.com",
    password: "123"
  }
};
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
  if (name) {
  const templateVars = {
    urls: urlDatabase,
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
  console.log(req.session.user_id)
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
  const templateVars = {
      urls: urlDatabase,
      shortURL: req.params.shortURL,
      longURL: urlDatabase[shortURL].longURL,
      user: req.session.user_id
    };
    res.render("urls_show", templateVars);
  });
  
app.get("/u/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: req.params.longURL,
    user: req.session.user_id
  };
  res.redirect("longUrl", templateVars);
});
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
  const password = req.body.password;
  const name = getUserByEmail(email, users);
  if (!email || !password) {
    res.status(400).send('400 Error: Must contain correct email or password');
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
  urlDatabase[shortURL] = req.body.updatedURL;
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
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
// registration
app.get("/registration", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
  const templateVars = {
    user: req.session.user_id
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
    res.session.user_id
    users[name] = {
      name,
      email,
      password
    }
  };
  res.redirect("/urls");
})

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


