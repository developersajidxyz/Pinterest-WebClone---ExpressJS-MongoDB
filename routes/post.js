const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/pinterestclone");

const postSchema = new mongoose.Schema({
  imageText: {
    type: String, 
    required: true 
  },
  image: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date, 
    default: Date.now 
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId, 
    default: [],
    ref: 'Like' 
  }],
});

module.exports = mongoose.model('Post', postSchema);


