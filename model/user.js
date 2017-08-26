var mongoose = require('mongoose');
var mongodb = require('mongodb');
var bcrypt = require('bcrypt');
var saltRounds = 10;


mongoose.connect('mongodb://localhost/contest');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var userSchema = new Schema({
    userId       : ObjectId,
    email        : String,
    username      : String,
    password      : Date
});


//The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural version of your model name.
// Then Mongoose will create the model for your users collection, not your user collection.
var User = mongoose.model('user',userSchema);
module.exports = User;

//save the user information
module.exports.createUser = function (newUser,callback) {
    newUser.save(callback);
}






// module.exports.createUser = function (newUser,callback) {
//     bcrypt.genSalt(saltRounds, function (err, salt) {
//         bcrypt.hash(newUser.password, salt, function (err, hash) {
//             // Store hash in your password DB.
//             newUser.password = hash;
//             newUser.save(callback);
//         });
//     });
