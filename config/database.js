const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/UserDetail');

const userSchema = mongoose.Schema({
    googleid: String,
    username: String,
    password: String
})



const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;