const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ayaan:1234@cluster0.idzcx6c.mongodb.net/flat-pg');

const userSchema = mongoose.Schema({
    googleid: String,
    username: String,
    password: String
})

const pgSchema = mongoose.Schema({
    name: String,
    price: String,
    type: String
})



const UserModel = mongoose.model('User', userSchema);
const pg = mongoose.model('pg', pgSchema);


module.exports = {
   UserModel, pg 
};