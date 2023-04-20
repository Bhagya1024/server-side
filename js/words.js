const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();


router.post('/saveword', async (req, res) => {
  try {
    const { word, meaning, pronunciation } = req.body;

    // Retrieve number of words currently in the database
    const wordsRef = admin.database().ref('words');
    const snapshot = await wordsRef.once('value');
    const numWords = snapshot.numChildren();

    // Save word data to Realtime Database with sequential random_order value
    const wordRef = wordsRef.push({
      word,
      meaning,
      pronunciation,
      random_order: numWords + 1 // Set random_order to number of words + 1
    });

    // Send success response
    res.status(200).send({
      message: 'Word saved successfully',
      id: wordRef.key,
    });
  } catch (error) {
    console.error('Error saving word: ', error);
    // Send error response
    res.status(500).send({
      message: 'Error saving word',
      error: error.message,
    });
  }
});


module.exports = router;
