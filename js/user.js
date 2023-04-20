const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

router.get('/usercount', async (req, res) => {
  try {
    const snapshot = await admin.database().ref('users').once('value');
    const count = snapshot.numChildren();
    res.status(200).send({
      count: count
    });
  } catch (error) {
    console.error('Error getting user count: ', error);
    res.status(500).send({
      message: 'Error getting user count',
      error: error.message
    });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Search for user with entered email and password and admin boolean is true
    const usersRef = admin.database().ref('users');
    const snapshot = await usersRef.orderByChild('email').equalTo(email).once('value');
    const users = snapshot.val();
    const user = users && Object.values(users).find(u => u.password === password && u.admin);

    if (user) {
      // Redirect to index.html
      res.status(200).send({
        message: 'Login successful'
      });
    } else {
      // Send error response
      res.status(401).send({
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    console.error('Error logging in: ', error);
    // Send error response
    res.status(500).send({
      message: 'Error logging in',
      error: error.message
    });
  }
});

module.exports = router;

