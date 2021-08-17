const express = require('express');
const router = express.Router();
const Activity = require('../../models/Activity');
const validateActivityInput = require('../../validate/validateActivityInput');
const moment = require('moment');
require('moment/locale/ca');

router.get('/test', (req, res) => res.json({ msg: 'backend works' }));

// @route GET /api/activities
// @desc Get all activities (public)
router.get('/', (req, res) => {
  Activity.find()
    .then(info => res.json(info))
    .catch(err => res.status(404).json({ msg: 'no activities found' }))
});

// @route GET /api/activities/:dateTime
// @desc Get all activities for a specific date or time (public)
router.get('/date/:dateTime', (req, res) => {
  const startDay = req.params.dateTime.slice(0, 10);
  const endDay = moment(req.params.dateTime).add(1, 'days').format().slice(0, 10);

  Activity.find({ dateTime: {$gte: `${startDay}T00:00:00.000Z`, $lt: `${endDay}T00:00:00.000Z`}})
    .then(info => res.json(info))
    .catch(err => res.status(404).json({ msg: 'no activities for this date found' }))
});

// generic filters (coordinates, distance, category, difficulty, dateTime)
router.get('/filters', (req, res) => {
  const lng = req.query.lng ? req.query.lng : 2.078728;
  const lat = req.query.lat ? req.query.lat : 41.3947688;
  const distance = req.query.distance ? req.query.distance : 10000;

  if (req.query.dateTime) {
    const startDay = req.query.dateTime.slice(0, 10);
    const endDay = moment(req.query.dateTime).add(1, 'days').format().slice(0, 10);
    console.log('startDay', startDay);
    console.log('endDay', endDay);
    req.query.dateTime = { $gte: `${startDay}T00:00:00.000Z`, $lt: `${endDay}T00:00:00.000Z` }
  }

  if (req.query.distance) delete req.query.distance;
  if (req.query.lng) delete req.query.lng;
  if (req.query.lat) delete req.query.lat;

  Activity.find({ $and: [
    {
      location: {
        $near: {
          $geometry: {
            type: "Point" ,
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseFloat(distance)
        }
      }
    },
    { ...req.query }
  ]})
  .then(info => res.json(info))
  .catch(err => res.status(404).json({ msg: 'no activities for the applied filter' }));
});


// @route GET /api/activities/id/:activityId
// @desc Get a specific activity (public)
router.get('/id/:activityId', (req, res) => {
  Activity.find({ _id: req.params.activityId })
    .then(info => res.json(info))
    .catch(err => res.status(404).json({ msg: 'there is no activity with this id' }))
});

// @route GET /api/activities/user/:userId
// @desc Get activities from a specific user (public)
router.get('/user/:userId', (req, res) => {
  Activity.find({ "createdBy.userId": req.params.userId })
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
    ...req.body
  });
  newActivity.save()
    .then(info => res.json(info))
    .catch(err => console.log(err));
});

// @route DELETE /api/activities
// @desc Delete activity (public)
router.delete('/:activityId', (req, res) => {
  Activity.findOneAndDelete({ _id: req.params.activityId })
    .then(() => { res.json({ success: true })
    .catch(err => res.json({ msg: 'could not delete entry' }))
  });
});

// @route UPDATE /api/activities/:activityId
// @desc Update activity (public)
router.put('/:activityId', (req, res) => {
  const { errors, isValid } = validateActivityInput(req.body);

  // Check validation
  if (!isValid) return res.status(400).json(errors);

  Activity.findOneAndUpdate(
    { _id: req.params.activityId } ,
    {
      $set: {
        ...req.body
      },
    },
    { new: true },
  )
    .then(info => res.json({ success: true, info }))
    .catch(err => res.status(400).json({ msg: 'update failed' }));
});

// @route UPDATE /api/activities/add_participant/:activityId/:userId
// @desc Update activity, add participant (public)
router.patch('/add_participant/:activityId/:userId/:userName', (req, res) => {

  Activity.findOneAndUpdate(
    { _id: req.params.activityId } ,
    { $addToSet: { participants: [ { userId: req.params.userId, userName: req.params.userName } ] }, },
    { new: true },
  )
    .then(info => res.json({ success: true, info }))
    .catch(err => res.status(400).json({ msg: 'update failed' }));
});

// @route UPDATE /api/activities/delete_participant/:activityId/:userId/:userName
// @desc Update activity, delete participant (public)
router.patch('/delete_participant/:activityId/:userId', (req, res) => {
  Activity.updateOne(
    { _id: req.params.activityId },
    { $pull: { participants: { userId: req.params.userId }} }
  )
    .then(() => res.json({ success: true }))
    .catch(err => res.status(400).json({ msg: 'update failed' }));
});

module.exports = router;

