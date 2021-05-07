const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ActivitySchema = new Schema({
  category: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  place: {
    type: String,
    required: true
  },
  longPlace: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  participants: {
    type: [String]
  },
  lat: {
    type: String,
    required: true
  },
  lng: {
    type: String,
    required: true
  },
});

module.exports = Activity = mongoose.model('activity', ActivitySchema);
