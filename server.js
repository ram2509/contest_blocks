var express = require('express');
//var morgan = require('morgan')
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHandlebars = require('express-handlebars');
var flash = require('connect-flash');
var session = require('express-session');
var usersDB = require('./model/usersdb');
var port = process.env.PORT || 5000;

var app = express();
//app.use(morgan('dev'));



//view engine
app.engine('.hbs', expressHandlebars({defaultLayout: 'layout',
    partialsDir: __dirname+'/views/partials',
    layoutsDir: __dirname+'/views/layouts',
    extname:'.hbs'
}));


app.set('view engine', '.hbs');
app.set('views',path.join(__dirname,'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookie: { maxAge: 60000 },
  secret: 'secretwork',
  saveUninitialized: false,
  resave: false
}));

app.use(flash());

var routes = {
   index : require('./routes/index'),
   users : require('./routes/users')
}

//catch 404 and forward to error handler
// app.use(function (req,res) {
//     res.render('notFound');
// });

app.use('/',routes.index);
app.use('/users',routes.users);

// usersDB.connectDB(function () {
//     app.listen(port,function (req,res) {
//         console.log('server is running on the port 5000');
//     });
// })
app.listen(port,function (req,res) {
    console.log('Server is runnning on port 5000');
});