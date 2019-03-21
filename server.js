require('./model/util/config.js');

const express = require('express');
const path = require('path');
const hbs = require('hbs');
const ejs = require('ejs-locals');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const validator = require('validator');

const {mongoose} = require('./model/db/db.js')  // database
const {Todo} = require('./model/util/tododata.js');
const {User} = require('./model/util/userdata.js');
const {authenticate} = require('./authenticate.js');

const app = express();
const bodyParser = require('body-parser');

app.engine('ejs', ejs);
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(session({
  secret: "todosecret",
  resave: true,
  saveUninitialized: true }));
app.use(flash());

// 靜態檔案位置
const publicPath = path.join(__dirname, '/public');
app.use(express.static(publicPath));
// 增加body解析
app.use(bodyParser.json());   // 解析json格式
app.use(bodyParser.urlencoded({extended: false}));  // 支援一般傳統表單格式


// routes
var routes = require('./route/index');
var user = require('./route/user')
app.use('/', routes);
app.use('/user', user);


app.use(function(err, req, res, next){
  console.log(err);
  if (err.name === 'JsonWebTokenError'){
    res.send({message: err.message});
    return;
  }
  next();
});


let port = process.env.PORT || 3000;

app.listen( port , () => {
  console.log(`Server is up on ${port}`);
});