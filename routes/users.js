var Hasher, colls, createHash, createSession, hash, valid;

colls = null;

Hasher = require('phpass').PasswordHash;

hash = new Hasher;

valid = function(pass, user) {
  return hash.checkPassword(pass, user.pass);
};

createHash = function(pass) {
  return hash.hashPassword(pass);
};

createSession = function(user, fn) {
  var date;
  date = new Date().getTime();
  return colls.sessions.post({
    target: user["_id"],
    expire: date + 36e5
  }, function(err, session) {
    return fn(err, session['_id']);
  });
};

exports.fetch = function(inColls) {
  return colls = inColls;
};

exports.authorize = function(req, fn) {
  var sid;
  sid = req.signedCookies['s_id'];
  if (sid) {
    return colls.sessions.get(sid, function(err, sess) {
      if (err) {
        return fn(err, null);
      } else {
        return colls.users.get(sess.target, function(err, user) {
          if (err) {
            return fn(err, null);
          } else {
            return fn(null, user);
          }
        });
      }
    });
  } else {
    return fn("no sid", null);
  }
};

exports.profile = {
  get: function(req, res) {
    return colls.users.get(req.params.id, function(err, user) {
      if (err) {
        return res.send(500, err);
      } else {
        return res.render("profile.html", {
          user: user
        });
      }
    });
  }
};

exports.expire = function() {
  var time;
  time = new Date().getTime();
  return colls.sessions.model.find().where("expire").gte(time).remove();
};

exports.authentication = {
  login: function(req, res) {
    var email, pass;
    email = req.query.email;
    pass = req.query.pass;
    return colls.users.model.find().where("email", email).exec(function(err, user) {
      if (err || !user[0]) {
        return res.send({
          isValid: false,
          error: "Please check your credientials, no user with that email was found."
        });
      } else {
        if (!valid(pass, user[0])) {
          return res.send({
            isValid: false,
            error: "Invalid password / email combination."
          });
        } else {
          return createSession(user[0], function(err, sess) {
            if (err) {
              return res.send({
                isValid: false,
                error: "There was an error when trying to generate your login session."
              });
            } else {
              res.cookie("s_id", sess, {
                signed: true
              });
              return res.send({
                isValid: true
              });
            }
          });
        }
      }
    });
  },
  signup: function(req, res) {
    var email, pass;
    email = req.body.email;
    if (req.body.pass1 === req.body.pass2) {
      pass = req.body.pass1;
    }
    if (!pass) {
      return res.send({
        error: "pass-err"
      });
    } else {
      return colls.users.model.find().where("email", email).exec(function(err, users) {
        if (err) {
          res.send({
            error: "usr-err"
          });
          return;
        }
        if (users.length > 0) {
          res.send({
            error: "usr-exists"
          });
          return;
        }
        return colls.users.post({
          email: email,
          pass: createHash(pass, function(err, user) {
            if (err) {
              return res.send({
                error: "post-err"
              });
            } else {
              return createSession(user, function(err, sess) {
                if (err) {
                  return res.send({
                    error: "sess-err"
                  });
                } else {
                  res.cookie("s_id", sess, {
                    signed: true
                  });
                  return res.send("reg");
                }
              });
            }
          })
        });
      });
    }
  }
};
