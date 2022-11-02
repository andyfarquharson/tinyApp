const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
})
// Form to get a new url
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id].longURL };
    res.render("urls_show", templateVars);
  });
  
  app.get("/u/:id", (req, res) => {
    const longURL = urlDatabase[req.params.id].longURL;
    res.redirect(urlDatabase[req.params.id].longURL);
    res.redirect(longURL);
  });
// Login with username
app.post("/login", (req, res) => {
  const user = req.body.user;
  res.cookie('username', user);
  res.redirect('/urls');
});

  // Deletes url from database  
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id; 
  delete urlDatabase[id];
  res.redirect("/urls");
})
// Updates url in the database
app.post("/urls/:id/", (req, res) => {
  const id = req.params.id;
  urlDatabase[id] = req.body.updatedURL;
  res.redirect("/urls");
})

app.post("/urls", (req, res) => {
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  res.redirect(`/urls/${id}`);
});

  app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

  
  
  
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


