var router = require('express').Router();
var Joi = require('joi');
var User = require('../model/user');
var FbUser = require('../model/fbuser');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
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

// router.get('/auth/facebook',function (req,res) {
//     res.send('redirect');
// })

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
        var newUser = new User(
        {
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
});

//Facebook login Strategy

var FACEBOOK_APP_ID = '705403943000436';
var FACEBOOK_APP_SECRET = '0ae3cb592c10b7a3b533a9ee899e962c';

passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:5000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        // find the user in the database based on their facebook id
        FbUser.getFbUserById(profile.id, function(err, fbUser) {

            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err)
                return done(err);

            // if the user is found, then log them in
            if (fbUser) {
                return done(null, fbUser); // user found, return that user
            } else {
                // if there is no user found with that facebook id, create them
                var newFbUser = new FbUser({
                     id : profile.id,
                     access_token : accessToken,
                     firstName : profile.name.givenName,
                     lastName  : profile.name.familyName,
                     email : profile.emails[0].value
                });

                // set all of the facebook information in our user model
                // newUser.fb.id    = profile.id; // set the users facebook id
                // newUser.fb.access_token = access_token; // we will save the token that facebook provides to the user
                // newUser.fb.firstName  = profile.name.givenName;
                // newUser.fb.lastName = profile.name.familyName; // look at the passport user profile to see how names are returned
                // newUser.fb.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                // save our user to the database
                FbUser.createFbUser(newFbUser,function (err,fbUser) {
                    if(err) throw err;
                    console.log(fbUser);
                    return done(null,newFbUser);
                });
            }
        });
    }
));

router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/users/dashboard',
        failureRedirect: '/' }));


module.exports = router;