var mongoose = require('mongoose');
var mongodb = require('mongodb');
var bcrypt = require('bcrypt');
var saltRounds = 10;
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/update');
var db = mongoose.connection;

var userSchema = new Schema({
    email        : String,
    username      :String,
    password      :String
});


var User = mongoose.model('user',userSchema);
module.exports = User;

module.exports.createUser = function (newUser,callback) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            // Store hash in your password DB
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

//local userID
module.exports.getUserByUserName = function (username,callback) {
    var query = {username:username};
    User.findOne(query,callback);
};

module.exports.getUserById = function (id,callback) {
    User.findById(id,callback);
}

module.exports.comparePassword = function (userPassword,hash,callback) {
    bcrypt.compare(userPassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null,isMatch);
    });
}

//fb useId
//create new user using fb id







