// src/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    id: String,
    content: String,
    likes: Number,
  // Add other fields as needed
    location: String,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
