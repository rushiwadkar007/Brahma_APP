const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require('mongodb');
const nftRoute = require('./routes/NFT');
const authRoute = require('./routes/auth');
var bodyParser = require('body-parser');
const cors  = require('cors')
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('error', err => {
  console.log('Connection failed.');
});

mongoose.connection.on('connected', connected => {
  console.log('Connection successful.');
});

app.use("/roles", nftRoute);
app.use("/user", authRoute);
app.use('/public', express.static('./public'));
app.listen(5050, () => { console.log("backend server is running on 5050..."); })