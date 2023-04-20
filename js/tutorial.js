const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const database = admin.database();


// Create a new tutorial
router.post('/savetutorial', async (req, res) => {
  try {
    const { lessonno, topic, description, video } = req.body;
    const tutorialRef = database.ref('tutorials').push();
    const tutorialData = {
      lessonno,
      topic,
      description,
      video
    };
    await tutorialRef.set(tutorialData);
    res.status(200).json({ message: 'Tutorial saved successfully' });
  } catch (error) {
    console.error('Error saving tutorial: ', error);
    res.status(500).json({ message: 'Error saving tutorial' });
  }
});



router.get('/viewtutorials', async (req, res) => {
  try {
    // Retrieve all the tutorials from the database
    const ref = admin.database().ref('tutorials');
    const snapshot = await ref.once('value');
    const tutorials = snapshot.val();
  
    // Send success response with the retrieved tutorials
    res.status(200).send(tutorials);
  } catch (error) {
    console.error('Error retrieving tutorials: ', error);
    // Send error response
    res.status(500).send({
      message: 'Error retrieving tutorials',
      error: error.message
    });
  }
});

// Delete a lesson by lesson number
router.delete('/deletetutorial/:lessonno', async (req, res) => {
  const lessonno = req.params.lessonno;
  try {
    const snapshot = await database.ref('tutorials').orderByChild('lessonno').equalTo(lessonno).once('value');
    const lesson = snapshot.val();
    if (!lesson) {
      // handle the case where the lesson is not found
      return res.status(404).json({ message: 'Lesson not found' });
    }
    await database.ref(`tutorials/${Object.keys(lesson)[0]}`).remove();
    res.json({ message: `Lesson ${lessonno} deleted successfully` });
  } catch (error) {
    console.error('Error deleting lesson: ', error);
    res.status(500).json({ message: 'Error deleting lesson' });
  }
});


router.get('/gettutorial/:lessonno', async (req, res) => {
  const lessonno = req.params.lessonno;

  try {
    const snapshot = await database.ref('tutorials').orderByChild('lessonno').equalTo(lessonno).once('value');
    const lesson = snapshot.val();

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.status(200).json(lesson[Object.keys(lesson)[0]]);
  } catch (error) {
    console.error('Error retrieving lesson: ', error);
    res.status(500).json({ message: 'Error retrieving lesson' });
  }
});

router.put('/updatetutorial/:lessonno', async (req, res) => {
  const lessonNo = req.params.lessonno;

  try {
    const lessonsRef = database.ref('tutorials');
    const query = lessonsRef.orderByChild('lessonno').equalTo(lessonNo);
    const snapshot = await query.once('value');
    if (snapshot.exists()) {
      snapshot.forEach(childSnapshot => {
        childSnapshot.ref.update({
          topic: req.body.topic,
          description: req.body.description,
          video: req.body.video
        });
      });
      res.status(200).json({ message: `Lesson ${lessonNo} updated successfully.` });
    } else {
      res.status(404).json({ error: `Lesson ${lessonNo} not found.` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the lesson.' });
  }
});

module.exports = router;
