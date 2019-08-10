const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  number: String,
  interests: [String],
  date: { type: Date, default: Date.now }
});
module.exports = userSchema;
