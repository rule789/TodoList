
const sendButton = document.querySelector('.sendButton');
const todoText = document.querySelector('.text');
const todoList = document.querySelector('.todoList');

// todo 列表
function listTodo(data) {
  data.reverse();
  let str = '';
  for (var i=0 ; i<data.length ; i++){
    if(data[i].complete){
      str +=
      ` <li class="todo" data-id="${data[i]._id}">
          <input class="checkbox" type="checkbox" checked=true > ${data[i].text}`
    } else {
      str +=
      ` <li class="todo" data-id="${data[i]._id}">
          <input class="checkbox" type="checkbox"> ${data[i].text}`
    }
    str +=
      ` <a href="#" class="del" >
          <i class="fas fa-trash-alt garbage"></i>
        </a>
      </li>`
  }
  todoList.innerHTML = str;
}


// 新增todo
function addTodo (e) {
  e.preventDefault();
  const todoInput = todoText.value;
  todoText.value = '';
  var newTodo = {
    message: todoInput
    };

  let url = window.location.origin;
  // console.log(url);
  // 'http://localhost:3000/newTodo'
  const xhr = new XMLHttpRequest();
  xhr.open('post', `${url}/newTodo` , true);
  xhr.setRequestHeader('Content-type','application/json');
  xhr.send(JSON.stringify(newTodo));
  xhr.onload = function() {
    var data = JSON.parse(xhr.responseText);
    // console.log(data);
    if(data.message === 'jwt must be provided'){
      alert('請先登入或註冊!!');
      return;
    }
    listTodo(data);
  }
}

sendButton.addEventListener('click', addTodo, false);

todoText.addEventListener('keyup', function(e){
  e.preventDefault();
  if(e.keyCode === 13) {
    sendButton.click();
  }
});



// 刪除todo
function delTodo(e) {
  if( e.target.nodeName == "I") {
    e.preventDefault();

    const id = e.target.parentNode.parentNode.dataset.id;
    const data = {id}
    let url = window.location.origin;

    var xhr = new XMLHttpRequest();
    xhr.open('delete', `${url}/delTodo`, true);
    xhr.setRequestHeader('Content-type','application/json');
    // console.log(data);
    xhr.send(JSON.stringify(data));
    xhr.onload = function() {
    var data = JSON.parse(xhr.responseText);
    listTodo(data);
    }
  }
}

todoList.addEventListener('click', delTodo, false);


// todo完成
$(document).on('click', '.checkbox',
  function(e){
    let id = $(this).parent().attr('data-id');
    let complete = $(this).prop('checked')?true:false;
    let time = new Date();
    // console.log(id, complete);
    $.ajax({
      url: '/updateTodo',
      type: 'PATCH',
      data: {
        id,
        complete: complete
      },
      success: function(data){
        console.log(data);
      }
    });
  }
);


// 更新


// 註冊
// 註冊頁面出現
$('#registerButton').click(function(event){
  event.preventDefault();
  $('#registerPage').toggle();
});

// 按取消註冊頁消失
$('.cancelRegister').click(function(){
  $('#registerPage').toggle();
});

// 註冊頁按送出
let sendRegister = document.querySelector('.sendRegister');
sendRegister.addEventListener('click', register, false);

function register(e) {
  let account = document.querySelector('.account');
  let password = document.querySelector('.password').value;
  let passwordCheck = document.querySelector('#passwordCheck').value;

  if(password !== passwordCheck) {
    alert('密碼有誤');
    e.preventDefault();
  }
}

// 登入頁出現
$('#loginButton').click(function(e) {
  e.preventDefault();
  $('#loginPage').toggle();
});

// 按取消登入頁消失
$('.cancelLogin').click(function(){
  $('#loginPage').toggle();
});

var url = window.location.href
if(url.indexOf('?')!= -1){
  var ary = url.split('?');
  var error = ary[1].split('=');
  var decode = decodeURIComponent(error[1]);
  // console.log(decode);
  if(decode == '帳號必填'){
    $('#registerPage').toggle();
    $('#account_require').toggle();
  } else if(decode == '密碼必填'){
    $('#registerPage').toggle();
    $('#pwd_require').toggle();
  } else if(decode == '密碼最少三碼'){
    $('#registerPage').toggle();
    $('#pwd_require').text('密碼最少三碼').toggle();
  } else if(decode == 11000){
    $('#registerPage').toggle();
    $('#account_require').text('已有人註冊').toggle();
  } else if(decode == "Cannot read property '_id' of null" || "Cannot read property '_id' of null#"){
    $('#loginPage').toggle();
    alert('帳號或密碼有誤');
  }
}


