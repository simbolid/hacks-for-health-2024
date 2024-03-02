const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from App Engine!');
});



const mongoose = require('mongoose');

const dev_db_url =
  "mongodb+srv://dbuser:admin@cluster0.afn1qa6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const url = "mongodb+srv://dbuser:admin@cluster0.afn1qa6.mongodb.net/"

mongoose.connect(dev_db_url);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;


// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
