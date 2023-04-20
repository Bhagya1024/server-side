const admin = require('firebase-admin');

const serviceAccount = require('../jupiter-ba5b1-firebase-adminsdk-992s5-f61ea10b0e.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://jupiter-ba5b1-default-rtdb.firebaseio.com",
  storageBucket: 'jupiter-ba5b1.appspot.com'
});


const express = require('express');

// Create Express.js app
const app = express();
const path = require('path');
// Serve static files from the 'client-side' directory
app.use(express.static(path.join(__dirname, 'client-side')));

// Serve login.html as the default page
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../client-side', 'login.html'));
});

// Configure middleware
app.use(express.static('../client-side'));
app.use(express.json());

// Define route for saving topic data
const topicRouter = require('../server-side/js/chattopic');
const wordRouter = require('../server-side/js/words');
const tutorialRouter = require('../server-side/js/tutorial');
const userRouter = require('../server-side/js/user');
app.use('/api', topicRouter);
app.use('/api', wordRouter);
app.use('/api', tutorialRouter);
app.use('/api', userRouter);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});