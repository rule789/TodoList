var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const {User} = require('../model/util/userdata.js');
const _ = require('lodash');


// 註冊
router.post('/register', (req, res) => {
  let data = req.body;
  let body = _.pick(req.body, ['account', 'password']);
  let user = new User(body);
  let token = jwt.sign({_id: user._id.toHexString()}, process.env.JWT_SECRET).toString();
  user.token = token;
  user.save().then((user) => {
    req.session.token = user.token;
    res.redirect('/');
  }).catch((error) => {
    let errorMessage;
    for (var item in error.errors){
      errorMessage = error.errors[item].message;
    }
    if(!errorMessage) {
      errorMessage = error.code;
    }
    req.flash('error', errorMessage);
    let encode = encodeURIComponent(errorMessage);
    res.redirect('/?error=' + encode );
  });
});

// 登出
router.get('/logout', (req, res) => {
  let token = req.session.token
  req.session.token = false;
  res.redirect('/');
});


// 登入
router.post('/login', (req, res) => {
  let data = req.body;
  User.findOne({
    account: data.account,
    password: data.password
  }).then((user) => {
    let token = jwt.sign({_id: user._id.toHexString()}, process.env.JWT_SECRET).toString();
    user.token = token;
    user.save().then((user) => {
      req.session.token = user.token;
      console.log(req.session);
      res.redirect('/');
      }, (e) => {
        return Promise.reject();
      });
    }).catch((error) => {
      let errorMessage = error.message;
      req.flash('error', '帳號或密碼有誤');
      console.log(error);
      let encode = encodeURIComponent(errorMessage);
      res.redirect('/?error=' + encode);
  });
});


module.exports = router;