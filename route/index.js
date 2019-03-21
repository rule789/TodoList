var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const {Todo} = require('../model/util/tododata.js');


// 路由 render
router.get('/', (req, res) => {
  let auth = req.session.token;
  if(auth) {
    let id = jwt.verify(auth, process.env.JWT_SECRET);
    // console.log(id);
    Todo.find({_creator: id._id}).then((todos) => {
      todos.reverse();
      res.render('todoList', {
        allTodo: todos,
        auth: auth,
        message: false,
        error: false
        });
    }, (e) => {
      res.status(400).send(e);
    });
  } else {
    res.render('todoList', {
      allTodo: [],
      message: "快來註冊登入!!",
      auth: auth,
      error: req.flash('error')
    });
  }

});


// 新增todo
router.post('/newTodo', (req, res) => {
  console.log(req.session.token);
  let token = jwt.verify(req.session.token, process.env.JWT_SECRET);
  console.log(token);

  var todo = new Todo({
    text: req.body.message,
    _creator: token._id
  });
  todo.save().then((todo) => {
    Todo.find({_creator: token._id}).then((doc)=>{
      console.log(doc);
      res.send(doc);
    })
  }, (e) => {
    console.log(e);
  });
});

// 刪除todo
router.delete('/delTodo', (req, res) => {
  var id = req.body.id
  Todo.findOneAndDelete({_id: id}).then((todo) => {
    Todo.find({_creator: todo._creator}).then((alltodo) => {
      console.log(alltodo);
      res.send(alltodo);
    });
  });
});


// todo完成
router.patch('/updateTodo', (req, res) => {
  let data = req.body;
  Todo.findOneAndUpdate( {_id: data.id}, {
   $set: {complete: data.complete}
  }, {returnOriginal: false}).then((todo) => {
    Todo.find({_creator: todo._id}).then((alltodo) => {
      res.send();
    });
  });
});


module.exports = router;