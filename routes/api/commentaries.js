const express = require('express');
const router = express.Router();
const Commentary = require('../../models/Commentary');
const { validateCommentaryInput, validateUpdatedCommentaryInput } = require('../../validate/validateCommentaryInput');

// @route GET /api/commentaries/
// @desc Get all commentaries (public)
router.get('/', (req, res) => {
  Commentary.find()
    .then(info => res.json(info))
    .catch(err => res.status(404).json({ msg: 'no commentaries found' }))
});

// @route GET /api/commentaries/:id_activity
// @desc Get commentaries of specific activity (public)
router.get('/:activityId', (req, res) => {
  Commentary.find({ activityId: req.params.activityId })
    .then(info => res.json(info))
    .catch(err => res.status(404).json({ msg: 'no commentaries for this activity found' }))
});

// @route GET /api/commentaries/user/:id_user
// @desc Get commentaries a user has written (to get activity id) (public)
router.get('/user/:userId', (req, res) => {
  Commentary.find({ "author.authorId": req.params.userId })
    .then(info => res.json(info))
    .catch(err => res.status(404).json({ msg: 'no commentaries for this user found' }))
});

// @route POST /api/commentaries/
// @desc Create new commentary (public)
router.post('/', (req, res) => {
  const { errors, isValid } = validateCommentaryInput(req.body);

  // Check validation
  if (!isValid) return res.status(400).json(errors);

  const newCommentary = new Commentary({
    ...req.body
  });
  newCommentary.save()
    .then(info => res.json(info))
    .catch(err => console.log(err));
});

// @route PATCH /api/commentaries/:activityId
// @desc Update commentary (public)
router.patch('/:commentaryId', (req, res) => {
  const { errors, isValid } = validateUpdatedCommentaryInput(req.body);

  // Check validation
  if (!isValid) return res.status(400).json(errors);

  Commentary.findOneAndUpdate(
    { _id: req.params.commentaryId } ,
    {
      $set: {
        message: req.body.message
      },
    },
    { new: true },
  )
    .then(info => res.json({ success: true, info }))
    .catch(err => res.status(400).json({ msg: 'update failed' }));
});

// @route DELETE /api/commentaries
// @desc Delete commentary (public)
router.delete('/:commentaryId', (req, res) => {
  Commentary.findOneAndDelete({_id: req.params.commentaryId})
    .then(() => { res.json({ success: true })
    .catch(err => res.json({ msg: 'could not delete entry' }))
  });
});

module.exports = router;
