const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const PORT = 8080; // default port 8080


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

function generateRandomString() {
  const result = Math.random().toString(36).substring(2,8);
  return result;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
// Homepage
app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: req.cookies["user"]
  };
  res.render("urls_index", templateVars);
});
// Form to get a new url
app.get("/urls/new", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    longURL: req.body.id,
    user: req.cookies["user"]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    id: req.params.id,
    longURL: req.params.id,
    user: req.cookies["user"]
  };
  res.render("urls_show", templateVars);
});
  
app.get("/u/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: req.params.id,
    user: req.cookies["user"]
  };
  res.redirect("longUrl", templateVars);
});
// Login with username
app.post("/login", (req, res) => {
  const user = req.params.user;
  res.cookie('user', user);
  res.redirect('/urls');
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
  res.redirect(`/urls/${id}`);
});
// Logout post
app.post("/logout", (req, res) => {
  res.clearCookie('user');
  res.redirect("/urls");
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


