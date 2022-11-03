const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
app.use(cookieParser());
const PORT = 8080; // default port 8080

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
// Function used to get short URL and username
function generateRandomString() {
  const result = Math.random().toString(36).substring(2,8);
  return result;
}
// 
// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
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
  if (req.cookies["username"]) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: req.cookies["username"]
  };
  if (req.cookies["username"]) {
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }
});
// Form to get a new url
app.get("/urls/new", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    longURL: req.body.id,
    user: req.cookies["username"]
  };
  if (!templateVars.user) {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    id: req.params.id,
    longURL: req.params.id,
    user: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});
  
app.get("/u/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: req.params.id,
    user: req.cookies["username"]
  };
  res.redirect("longUrl", templateVars);
});
// Login with username
app.get("/login", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    id: req.params.id,
    longURL: req.params.id,
    user: req.cookies["username"]
  };  
  if (req.cookies["username"]) {
    res.redirect("/urls")
  } else {
  res.render("urls_login", templateVars);
  }
})

app.post("/login", (req, res) => {
  for (let key in users) {
    if (users[key].email === req.body.email) {
      if (users[key].password === req.body.password) {
        res.cookie('username', users[key].name)        
        res.redirect("/urls");
      } else {
        res.clearCookie('user');
        res.redirect("/login");
      }
    }
  }res.clearCookie('user');
  res.redirect("/login");


});


// Deletes url from database
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});
// Updates url in the database
app.post("/urls/:id/", (req, res) => {
  const id = req.params.id;
  urlDatabase[id] = req.body.updatedURL;
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  if (req.cookie["username"]) {
  res.redirect(`/urls/${id}`);
  } else {
  res.status(400).send('400 Error: Must be logged in to save urls');
  }
});
// Logout post
app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/login");
});
// registration
app.get("/registration", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    id: req.params.id,
    longURL: req.params.id,
    user: req.cookies["username"]
  };
  if (req.cookies["username"]) {
    res.redirect("/urls");
  } else {
  res.render("urls_registration", templateVars);
  }
})

app.post("/registration", (req, res) => {
  const name = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400).send('400 Error: Must contain correct email or password');
  } else {
    res.cookie('name', users.name)
    users[name] ={
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


