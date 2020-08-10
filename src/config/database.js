
const mongoose = require("mongoose");

const URI = process.env.MONGODB_CLUSTER
  ? process.env.MONGODB_CLUSTER
  : "mongodb://localhost/CarTest";

mongoose.connect(URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
console.log('db is connected')