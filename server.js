
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");
const user = require("./models/user");

dotenv.config();
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("connected to mongodb"))
.catch((err) => console.log(err));

app.get("/", (req, res) =>
res.sendFile(path.join(__dirname, "views", "login.html")));
app.get("/signup", (req, res) => 
res.sendFile(path.join(__dirname, "views", "signup.html")));


app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
   const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashed });
 res.redirect('/');
});
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.send('User not found');

  const match = await bcrypt.compare(password, user.password);
  if(!match) return res.send("Invalid password");
res.send("login successful  🎉");
});
app.listen(3000, () => console.log('server running on http://localhost:3000'));