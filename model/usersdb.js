var mongodb = require('mongodb');
var url = 'mongodb://localhost:27017/contest';
var obj = '';
 
function connectDB (run_server) {
    mongodb.MongoClient.connect(url,function (err,db) {
        if(err) throw err;
        console.log('Connection is established');
        obj = db;
        run_server();
    })
}

function insertNewUser(newUser,callback) {
    obj.collection('users').insertMany(newUser,function (err,result) {
        if(err) throw err;
        console.log(result);
        callback(result);
    })
}

module.exports = {
    connectDB : connectDB,
    insertNewUser : insertNewUser
}