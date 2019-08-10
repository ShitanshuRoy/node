const mongoose = require("mongoose");
const express = require("express");
const config = require("config");
const app = express();
const helmet = require("helmet");
const courses = require("./routes/courses");
const home = require("./routes/home");
const logger = require("./logger");
//Configuration
console.log("Application", config.get("name"));
console.log("Mail Server", config.get("mail.host"));
mongoose
  .connect("mongodb://localhost/dustbin")
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch(err => console.error("Could not connect to MongoDb", err));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//arrays Complex objects in url encoded format
app.use(express.static("public"));
//Serve static files
app.use(helmet());
app.use(logger);
app.use("/api/courses", courses);
app.use("/", home);
app.get("/", (req, res) => {
  res.send("Hello World!!!!");
});

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`Listening on Port ${PORT}`);
});
