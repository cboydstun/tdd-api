const mongoose = require("mongoose");
require("dotenv").config();

const mongoDB = process.env.ATLAS_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

module.exports = db;