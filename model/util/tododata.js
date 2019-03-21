const mongoose = require('mongoose');

// 資料架構
const todoSchema = new mongoose.Schema({
  text:{
    type: String,
    require: [true, '必填'],
    minlength: 1,
    trim: true,
  },
  complete:{
    type: Boolean,
    default: false,
  },
  completeAt:{
    type: Number,
    default: null
  },
  _creator: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  }
});


// 建立collection(model)
let Todo = mongoose.model('Todo', todoSchema);

module.exports = {Todo};