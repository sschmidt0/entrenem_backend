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

// @route GET /api/activities/category/:category
// @desc Get activities from a specific category (public)
router.get('/category/:category', (req, res) => {
  Activity.find({ category: req.params.category })
    .then(info => res.json(info))
    .catch(err => res.status(404).json({ msg: 'no activitites for this category found' }))
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
    date: req.body.date,
    time: req.body.time,
    place: req.body.place,
    longPlace: req.body.longPlace,
    description: req.body.description,
    createdBy: req.body.createdBy,
    createdByName: req.body.createdByName,
    participants: participants,
    lat: req.body.lat,
    lng: req.body.lng,
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
router.put('/:id', (req, res) => {
  const { errors, isValid } = validateActivityInput(req.body);

  // Check validation
  if (!isValid) return res.status(400).json(errors);

  Activity.findOneAndUpdate(
    { _id: req.params.id } ,
    {
      $set: {
        category: req.body.category,
        title: req.body.title,
        date: req.body.date,
        time: req.body.time,
        place: req.body.place,
        longPlace: req.body.longPlace,
        description: req.body.description,
        createdBy: req.body.createdBy,
        createdByName: req.body.createdByName,
        participants: req.body.participants,
        lat: req.body.lat,
        lng: req.body.lng
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
    { $push: { participants: [ { userId: req.params.id_user, userName: req.params.userName } ] }, },
    { new: true },
  )
    .then(info => res.json(info))
    .catch(err => res.status(400).json({ msg: 'update failed' }));
});

// @route UPDATE /api/activities/delete_participant/:id_activity/:id_user
// @desc Update activity, delete participant (public)
router.patch('/delete_participant/:id_activity/:id_user', (req, res) => {
  Activity.updateOne(
    { _id: req.params.id_activity },
    { $pullAll: { participants: [req.params.id_user] } }
  )
    .then(() => res.json({ success: true }))
    .catch(err => res.status(400).json({ msg: 'update failed' }));
});

module.exports = router;

