var mongoose = require('mongoose');
var mongodb = require('mongodb');
var bcrypt = require('bcrypt');
var saltRounds = 10;
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/fbUser');
var db = mongoose.connection;

var fbUserSchema = new Schema({
    id: String,
    access_token : String,
    firstName : String,
    lastName : String,
    email : String
});

var FbUser = mongoose.model('fbUser',fbUserSchema);
module.exports = FbUser;

module.exports.createFbUser = function (newFbUser,callback) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(newFbUser.password, salt, function(err, hash) {
            // Store hash in your password DB
            newFbUser.password = hash;
            newFbUser.save(callback);
        });
    });
};

module.exports.getFbUserById = function (id,callback) {
    var query = {id:id};
    FbUser.findOne(query,callback);
}