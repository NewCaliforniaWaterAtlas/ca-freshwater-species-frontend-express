// auth.js

var auth = require('basic-auth');

var
  admin = process.env.USER,
  admins = {};

admins[admin] = { password: process.env.PASS };

module.exports = function(req, res, next) {

  var user = auth(req);
  if (!user || !admins[user.name] || admins[user.name].password !== user.pass) {
    res.set('WWW-Authenticate', 'Basic realm="example"');
    return res.status(401).send();
  }
  return next();
};
