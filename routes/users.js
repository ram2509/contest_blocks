var router = require('express').Router();
var Joi = require('joi');
var User = require('../model/user');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
//var userDB = require('../model/usersdb');

//validation of register page data
var schema = Joi.object().keys({
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().min(5).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required(),
    confirmPassword : Joi.any().valid(Joi.ref('password')).required()
});

//render the login page
router.get('/login',function (req,res) {
    res.render('login');
});

//render the register page
router.get('/register',function (req,res) {
    res.render('register');
});

router.get('/dashboard',function(req,res) {
    res.render('dashboard');
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

passport.use(new localStrategy(
    function(username, password, done) {
        User.getUserByUserName(username, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            User.comparePassword(password,user.password,function (err,isMatch) {
               if(err) {return done(err);}
               if(isMatch){
                   return done(null,user);
               }
               else {
                   return done(null,false,{message:'Invalid password'});
               }
            })

        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local',{ successRedirect: '/users/dashboard',
                                    failureRedirect: '/login' }),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.redirect('/users/dashboard');
    });

router.get('/logout',function (req,res) {
    req.logout();
    res.redirect('/users/login');
})

module.exports = router;