const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CommentarySchema = new Schema({
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  author: {
    authorId: {
      type: String,
      required: true
    },
    authorName: {
      type: String,
      required: true
    },
  },
  activityId: {
    type: String,
    required: true
  }
});

module.exports = Commentary = mongoose.model('commentary', CommentarySchema);
