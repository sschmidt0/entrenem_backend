const express = require('express');
const router = express.Router();
const Activity = require('../../models/Activity');
const validateActivityInput = require('../../validate/validateActivityInput');

router.get('/test', (req, res) => res.json({ msg: 'backend works' }));

// @route GET /api/activities
// @desc Get all activities (public)
router.get('/', (req, res) => {
  Activity.find()
    .then(info => res.json(info))
    .catch(err => res.status(404).json({ msg: 'no activities found' }))
});

// @route GET /api/activities/:date
// @desc Get all activities for a specific date (public)
router.get('/:dateTime', (req, res) => {
  Activity.find({ dateTime: req.params.dateTime })
    .then(info => res.json(info))
    .catch(err => res.status(404).json({ msg: 'no activities for this date' }))
});

// @route GET /api/activities/:user_coords/:distance
// @desc Get all activities within a specific distance (public)
router.get('/:user_coords/:distance', (req, res) => {
  const coords = req.body.user_coords;
  Activity.find({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: coords },
        $maxDistance: req.body.distance
      }
    }
  })
    .then(info => res.json(info))
    .catch(err => res.status(404).json({ msg: 'no activities within this distance' }))
});

// @route GET /api/activities/:difficulty
// @desc Get all activities of a specific difficulty (public)
router.get('/:difficulty', (req, res) => {
  Activity.find({ difficulty: req.params.difficulty })
    .then(info => res.json(info))
    .catch(err => res.status(404).json({ msg: 'no activities for this difficulty' }))
});

// @route GET /api/activities/category/:category
// @desc Get activities from a specific category (public)
router.get('/categories/:category', (req, res) => {
  Activity.find({ category: req.params.category })
    .then(info => res.json(info))
    .catch(err => res.status(404).json({ msg: 'no activitites for this category found' }))
});

// @route GET /api/activities/:id_activity
// @desc Get a specific activity (public)
router.get('/:id_activity', (req, res) => {
  Activity.find({ _id: req.params.id_activity })
    .then(info => res.json(info))
    .catch(err => res.status(404).json({ msg: 'there is no activity with this id' }))
});

// @route GET /api/activities/user/:id_user
// @desc Get activities from a specific user (public)
router.get('/user/:id_user', (req, res) => {
  Activity.find({ createdBy: req.params.id_user })
    .then(info => res.json(info))
    .catch(err => res.status(404).json({ msg: 'no activitites for this user found' }))
});

// @route POST /api/activities
// @desc Create new activity (public)
router.post('/', (req, res) => {
  const { errors, isValid } = validateActivityInput(req.body);

  // Check validation
  if (!isValid) return res.status(400).json(errors);

  const participants = req.body.participants ? req.body.participants : [];

  const newActivity = new Activity({
    category: req.body.category,
    title: req.body.title,
    dateTime: req.body.dateTime,
    place: req.body.place,
    longPlace: req.body.longPlace,
    city: req.body.city,
    description: req.body.description,
    createdBy: req.body.createdBy,
    createdByName: req.body.createdByName,
    participants: participants,
    difficulty: req.body.difficulty,
    location: {
      type: 'Point',
      coordinates: [ req.body.lat, req.body.lng ],
      city: req.body.city,
    }
  });
  //res.send(newActivity);
  newActivity.save()
    .then(info => res.json(info))
    .catch(err => console.log(err));
});

// @route DELETE /api/activities
// @desc Delete activity (public)
router.delete('/:id', (req, res) => {
  Activity.findOneAndDelete({_id: req.params.id})
    .then(() => { res.json({ success: true })
    .catch(err => res.json({ msg: 'could not delete entry' }))
  });
});

// @route UPDATE /api/activities/:id
// @desc Update activity (public)
router.patch('/:id', (req, res) => {
  const { errors, isValid } = validateActivityInput(req.body);

  // Check validation
  if (!isValid) return res.status(400).json(errors);

  Activity.findOneAndUpdate(
    { _id: req.params.id } ,
    {
      $set: {
        category: req.body.category,
        title: req.body.title,
        dateTime: req.body.dateTime,
        place: req.body.place,
        longPlace: req.body.longPlace,
        city: req.body.city,
        description: req.body.description,
        createdBy: req.body.createdBy,
        createdByName: req.body.createdByName,
        participants: req.body.participants,
        difficulty: req.body.difficulty,
        location: {
          type: 'Point',
          coordinates: [ req.body.lat, req.body.lng ],
          city: req.body.city,
        }
      },
    },
    { new: true },
  )
    .then(info => res.json(info))
    .catch(err => res.status(400).json({ msg: 'update failed' }));
});

// @route UPDATE /api/activities/add_participant/:id_activity/:id_user
// @desc Update activity, add participant (public)
router.patch('/add_participant/:id_activity/:id_user/:user_name', (req, res) => {
  Activity.findOneAndUpdate(
    { _id: req.params.id_activity } ,
    { $push: { participants: [ { userId: req.params.id_user, userName: req.params.user_name } ] }, },
    { new: true },
  )
    .then(info => res.json(info))
    .catch(err => res.status(400).json({ msg: 'update failed' }));
});

// @route UPDATE /api/activities/delete_participant/:id_activity/:id_user
// @desc Update activity, delete participant (public)
router.patch('/delete_participant/:id_activity/:id_user/:user_name', (req, res) => {
  Activity.updateOne(
    { _id: req.params.id_activity },
    { $pullAll: { participants: [ { userId: req.params.id_user, userName: req.params.user_name } ] }, }
  )
    .then(() => res.json({ success: true }))
    .catch(err => res.status(400).json({ msg: 'update failed' }));
});

module.exports = router;

