const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const app = express();
const port = process.env.PORT || 3000;

// Load service account key (adjust the path to point one level up)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);// rename your JSON to this if needed
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(bodyParser.json());

app.post('/send-notification', async (req, res) => {
  const { token, title, body } = req.body;

  if (!token || !title || !body) {
    return res.status(400).send('Missing fields');
  }

  const message = {
    notification: {
      title,
      body,
    },
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    res.status(200).send({ message: 'Notification sent', response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send('Failed to send notification');
  }
});

app.listen(port, () => {
  console.log(`Notification server running at http://localhost:${port}`);
});
