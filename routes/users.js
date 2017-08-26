var router = require('express').Router();
var Joi = require('joi');
var User = require('../model/user');
//var userDB = require('../model/usersdb');

//render the login page
router.get('/login',function (req,res) {
    res.render('login');
});

//render the register page
router.get('/register',function (req,res) {
    res.render('register');
});

//validation of register page data
var schema = Joi.object().keys({
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().min(5).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required(),
    confirmPassword : Joi.any().valid(Joi.ref('password')).required()
});

router.post('/register',function (req,res,next) {
    var result = Joi.validate(req.body,schema);
    if(result.error){
        console.log('user input is invalid');
        res.redirect('/users/register');
        return;
    }
    else{
         console.log('No error');
         // var user = {
         //     email : result.value.email,
         //     username : result.value.username,
         //     password : result.value.password
         // }
         // userDB.insertNewUser(user,function (result) {
         //     console.log(result);
         // });
        var newUser = new User({
            email : result.value.email,
            username : result.value.username,
            password : result.value.password
        });

        User.createUser(newUser,function(err,user) {
            if(err) throw err;
            console.log(user);
        });
        res.redirect('/users/login');
    }
    console.log('success');
});


module.exports = router;