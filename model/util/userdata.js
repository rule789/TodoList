const mongoose = require('mongoose');
const validator = require('validator');

// 資料架構
const userSchema = new mongoose.Schema({
  account:{
    required: [true, '帳號必填'],
    type: String,
    unique: true,
    trim: true,
    minlength:1,
  },
  password: {
    required: [true, '密碼必填'],
    type: String,
    trim: true,
    minlength: [3, '密碼最少三碼']
  },
  token:{
    type: String,
    required: true,
  }
});

// 建立User collection(model)
let User = mongoose.model('User', userSchema);

module.exports = {User};
