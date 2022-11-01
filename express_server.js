const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
// Homepage
app.get("/", (req, res) => {
  res.send("Hello!");
});
// Hellopage
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  console.log(req.body); // Log the POST request body to the console
  res.render("urls_index", templateVars);
  res.redirect("/urls/:id"); // Redirects the user to the id page
});
// Database
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/u/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: req.params.id };
  res.render("urls_show", templateVars);
  const longURL = req.params.id
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {
  const result = Math.random().toString(36).substring(1,7);
return result;
}
generateRandomString();