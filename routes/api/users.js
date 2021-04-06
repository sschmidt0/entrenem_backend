const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

// MongoDB Model
const User = require('../../models/User');

// VALIDATION Import
//const { credentialValidaton } = require('../../utils/validation');

// Load input validation
const validateRegisterInput = require('../../validate/validateRegisterInput');
const validateLoginInput = require('../../validate/validateLoginInput');

// Register User
router.post('/registrar', (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "El correu electrònic ja existeix" });
    } else {
      const newUser = new User({
        email: req.body.email,
        password: req.body.password
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// Login User
// router.post('/iniciar', async(req, res) => {
// 	const { error } = credentialValidation(req.body);
// 	if (error) return res.status(400).send(error.details[0].message);

// 	// Check if Email Exists
// 	const user = await User.findOne({ email: req.body.email });
// 	if(!user) return res.status(400).send('Email Does Not Exist');

// 	const validPass = await bcrypt.compare(req.body.password, user.password)
// 	if(!validPass) return res.status(400).send('Invalid Password');

// 	// Create & Assign Token
// 	const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
// 	res.header('auth-token', token).send(token);
// });

router.post('/iniciar', (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Find user by email
  User.findOne({ email: req.body.email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "No hi ha cap usuari amb aquest correu" });
    }

    // Check password
    bcrypt.compare(req.body.password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              user
            });
          }
        );
      } else {
        return res.status(400).json({ passwordincorrect: "Paraula de pas no és correcta" });
      }
    });
  });
});

module.exports = router;
