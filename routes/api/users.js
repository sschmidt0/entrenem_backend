const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

// MongoDB Model
const User = require('../../models/User');

// Load input validation
const validateRegisterInput = require('../../validate/validateRegisterInput');
const validateLoginInput = require('../../validate/validateLoginInput');

// @route POST /api/users/registrar --> register user
// @desc Post user (public)
router.post('/registrar', (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) return res.status(400).json(errors);

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "El correu electrònic ja existeix" });
    } else {
      const newUser = new User({
        ...req.body
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


// @route POST /api/users/iniciar --> login user
// @desc Post user (public)
router.post('/iniciar', (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) return res.status(400).json(errors);

  // Find user by email
  User.findOne({ email: req.body.email }).then(user => {
    // Check if user exists
    if (!user) return res.status(404).json({ email: "No hi ha cap usuari amb aquest correu" });

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
        return res.status(400).json({ password: "Paraula de pas no és correcta" });
      }
    });
  });
});

// @route DELETE /api/users
// @desc Delete user (public)
router.delete('/:userId', (req, res) => {
  User.findOneAndDelete({_id: req.params.userId})
    .then(() => { res.json({ success: true })
    .catch(err => res.json({ msg: 'could not delete user' }))
  });
});

module.exports = router;
