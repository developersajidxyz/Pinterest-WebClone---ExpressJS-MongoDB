const mongoose = require('mongoose');
const plm = require("passport-local-mongoose")
// Connect to the MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/pinterestclone");

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  dp: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
});


userSchema.plugin(plm);
// Export the user schema as a Mongoose model
module.exports = mongoose.model('User', userSchema);