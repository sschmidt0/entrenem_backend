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
  dateTime: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdBy: {
    userId: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    }
  },
  participants: {
    type: Array,
  },
  difficulty: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      required: true
    },
    city: {
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
    coordinates: {
      type: Array,
      required: true
    },
  }
});

module.exports = Activity = mongoose.model('activity', ActivitySchema);
