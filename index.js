const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv/config');

// imports the API from the routes/api folder
const activities = require('./routes/api/activities');
const users = require('./routes/api/users');
const commentaries = require('./routes/api/commentaries');

// initializes the express application
const app = express();

// sets up CORS for Cross-Origin-Resource-Sharing
app.use(cors());
// converts API responses to JSON for easy use
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// imports our database credentials (stored separately for security)
const db = require('./config/keys').mongoURI;

// initializes our database using the credentials
//mongoose.set('useFindAndModify', false);    // ?????
mongoose
  .connect(
    db,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// creates a route where we can interact with our API
app.use('/api/activities', activities);
app.use('/api/users', users);
app.use('/api/commentaries', commentaries);

// sets the port number depending if we are in production or development
const port = process.env.PORT || 5000;

// intializes the server and logs a message
app.listen(port, () => console.log(`Server up and running on port ${port}!`));
