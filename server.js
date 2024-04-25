const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');
const app = express();
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/employees',{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

const LogInSchema = new mongoose.Schema({
    _id : { type: mongoose.Types.ObjectId, required: true },
    name : String,
    License : String,
    Occupation : String
});
const User = mongoose.model('inventory',LogInSchema);

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/retrieve', async (req, res) => {
  try {
    // Hardcoded license number for testing
    const userId = "1237";
    const existingUser = await User.findOne({ License: userId });

    if (existingUser) {
      // Encrypt
      const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(existingUser), 'secret key 123').toString();
      return res.status(200).send(ciphertext);
    } else {
      return res.status(404).send('No such User Found!');
    }
  } catch (error) {
    console.log('Error Finding User', error);
    return res.status(500).send("Error Retrieving Data");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});