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
  writtenBy: {
    type: String,
    required: true
  },
  writtenByName: {
    type: String,
    required: true
  },
  activityID: {
    type: String,
    required: true
  }
});

module.exports = Commentary = mongoose.model('commentary', CommentarySchema);
