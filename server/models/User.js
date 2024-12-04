const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  city: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
