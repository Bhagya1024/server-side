const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Define POST route for saving topic data
router.post('/savechattopic', async (req, res) => {
  const { topic }  = req.body;
  const ref = admin.database().ref('chattopics');
  const snapshot = await ref.once('value');
  const count = snapshot.numChildren();
  const newTopic = {
    topic,
    topicno: count + 1
  };
  ref.push(newTopic)
    .then(() => {
      res.send('Topic saved successfully!');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error saving topic.');
    });
});

module.exports = router;
