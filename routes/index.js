var router = require('express').Router();

router.get('/',ensureAuthentication,function (req,res) {
    res.render('index');
});

function ensureAuthentication(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    else {
        res.redirect('/users/login');
    }
}

module.exports = router;