const generateRandomString = () => {
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
const getUserbyID = (id, users) => {
  const user = users[id];
  if (user) {
    return user;
  }
  return null;
}
// const urlDatabase = {};
const getURLsByUserID = (userID, urlDatabase) => {
  let userURLDatabase = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].user_id === userID) {
      userURLDatabase[url] = urlDatabase[url] 
    }
  }
  return userURLDatabase;
}
module.exports = {generateRandomString, getURLsByUserID, getUserbyID, getUserByEmail}