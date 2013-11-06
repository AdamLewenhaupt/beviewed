var authorize, colls, flow;

flow = require("../services");

authorize = require('./users').authorize;

colls = null;

exports.fetch = function(inColls) {
  return colls = inColls;
};

exports.get = function(req, res) {
  return authorize(req, function(err, user) {
    if (err) {
      return res.redirect("/");
    } else {
      return res.render("write.html", {
        communities: user.admin
      });
    }
  });
};

exports.newFeed = function(req, res) {
  return colls.communities.get(req.params.id, function(err, community) {
    var data;
    if (err) {
      return res.send(500, "404-community");
    } else {
      data = req.body.fields;
      data.community = req.params.id;
      if (community.type === "creative") {
        return colls.creatorFeeds.post(data, function(err) {
          if (err) {
            return res.send(500, "500-feed");
          } else {
            flow.io.sockets["in"]("community/" + req.params.id).emit("community/update", {});
            return res.send("success");
          }
        });
      } else {
        return res.send(500, "404-type");
      }
    }
  });
};
