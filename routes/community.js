var communities, fs;

fs = require('fs');

communities = null;

exports.fetchCommunities = function(data) {
  return communities = data;
};

exports.get = function(req, res) {
  return communities.get(req.params.id, function(err, community) {
    return res.render("community.html", {
      community: community
    });
  });
};

exports.init = function(data) {
  return communities.post(data, function(c) {
    return console.log(c);
  });
};

exports.log = function() {
  console.log("Running community logger");
  return communities.model.find().exec(function(err, data) {
    if (!err) {
      return data.forEach(function(community) {
        community.userCountLog.push(community.userCount);
        return community.save();
      });
    } else {
      return console.log("Error running community logger");
    }
  });
};

exports.post = function(req, res) {
  return communities.post(req.body, function(err, community) {
    var path;
    if (err) {
      return res.send(500, "save-err");
    } else {
      path = "./client/img/icons/" + community['_id'];
      return fs.writeFile(path, req.body.icon, 'binary', function(err) {
        if (err) {
          return res.send(500, "img-err");
        } else {
          return res.send(200, "success");
        }
      });
    }
  });
};
