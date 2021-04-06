const express = require('express');
const router = express.Router();
const Commentary = require('../../models/Commentary');
const validateCommentaryInput = require('../../validate/validateCommentaryInput');

// @route GET /api/commentaries/
// @desc Get all commentaries (public)
router.get('/', (req, res) => {
  Commentary.find()
    .then(info => res.json(info))
    .catch(err => res.status(404).json({ msg: 'no commentaries found' }))
});

// @route GET /api/commentaries/:id_activity
// @desc Get commentaries of specific activity (public)
router.get('/:id_activity', (req, res) => {
  Commentary.find({ activityID: req.params.id_activity })
    .then(info => res.json(info))
    .catch(err => res.status(404).json({ msg: 'no commentaries for this activity found' }))
});

// @route GET /api/commentaries/:id_user
// @desc Get commentaries a user has written (to get activity id) (public)
router.get('/:id_user', (req, res) => {
  Commentary.find({ writtenBy: req.params.id_user })
    .then(info => res.json(info))
    .catch(err => res.status(404).json({ msg: 'no commentaries for this user found' }))
});

// @route POST /api/commentary/:id_activity
// @desc Create new activity (public)
router.post('/', (req, res) => {
  const { errors, isValid } = validateCommentaryInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newCommentary = new Commentary({
    message: req.body.message,
    writtenBy: req.body.writtenBy,
    activityID: req.body.activityID
  });
  newCommentary.save()
    .then(info => res.json(info))
    .catch(err => console.log(err));
});

module.exports = router;
