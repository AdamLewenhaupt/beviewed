/*
Module dependencies.
*/

var app, express, http, path, routes, swoosh;

express = require("express");

http = require("http");

path = require("path");

routes = require('./routes');

swoosh = require('swoosh');

app = express();

swoosh(path.join(__dirname, "swoosh.yml"), function(err, collections) {
  if (err) {
    return console.log("Swoosh err:", err);
  } else {
    return this.route(app);
  }
});

app.engine("html", require('ejs').renderFile);

app.set("port", process.env.PORT || 3000);

app.set("views", __dirname + "/views");

app.set("view engine", "ejs");

app.use(express.favicon());

app.use(express.logger("dev"));

app.use(express.bodyParser());

app.use(express.methodOverride());

app.use(app.router);

app.use(express["static"](path.join(__dirname, "client")));

app.get("/", routes.index.get);

app.get("/profile", routes.profile.get);

if ("development" === app.get("env")) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get("port"), function() {
  return console.log("Express server listening on port " + app.get("port"));
});
