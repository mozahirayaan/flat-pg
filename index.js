/*const express = require('express');
const app = express();
const mongoose = require('mongoose');

const url = "mongodb://localhost:27017/UserDetail";
mongoose.connect(url, { });

const db = mongoose.connection;

db.once('open', () => {
    console.log('Connected to MongoDB');
    const myobj = { name: "Company Inc", address: "Highway 37" };

    // Use the db object to interact with the database
    db.collection("users").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();  // Optionally close the connection (this might not be needed depending on your use case)
    });
});

app.listen(7000, () => {
    console.log('Server is listening on port 7000');
}); */
const express = require('express');
const app = express();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("UserDetail");
  var myobj = { name: "Company Inc", address: "Highway 37" };
  dbo.collection("users").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});
