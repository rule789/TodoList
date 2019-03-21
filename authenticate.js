const {User} = require('./model/util/userdata.js');

let authenticate = (req,res, next) => {
  let token;
   try {
    token = req.session.token;
    let id = jwt.verify(token, '123abc');
  } catch(e) {
    return Promise.reject();
  }

  User.findOne({
    _id: id,
    token: token
  }).then((account) => {
    if(!user) {
      return Promise.reject();
    }
    req.account = account;
    req.token = token;
    next();

  }).catch((e) => {
    res.status(401).send();
  });
}

module.exports = {authenticate};