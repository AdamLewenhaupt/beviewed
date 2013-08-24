
###
Module dependencies.
###
express = require("express")
http = require("http")
path = require("path")
routes = require('./routes')
swoosh = require('swoosh')
timers = require('timers')
app = express()

swoosh (path.join __dirname, "swoosh.yml"), (err, collections) ->
	if err
		console.log "Swoosh err:", err
	else
		this.route app
		routes.fetch collections
		timers.setInterval ( () -> routes.community.log() ), 86400000

# all environments
app.engine "html", require('ejs').renderFile
app.set "port", process.env.PORT or 3000
app.set "views", __dirname + "/views"
app.set "view engine", "ejs"
app.use express.favicon()
app.use express.logger("dev")
app.use express.compress("dev")
app.use express.bodyParser()
app.use express.methodOverride()
app.use app.router
app.use express.static(path.join(__dirname, "client"))

app.get "/", routes.index.get
app.get "/profile/:id", routes.users.profile.get
app.get "/community/:id", routes.community.get
app.get "/explore", routes.explore.get
app.get "/dashboard/:id", routes.dashboard.get
app.get "/create-community", routes["create-community"].get
app.get "/community-min/:id", routes.community.min.get
app.get "/community-explore/:type", routes.community.explore.get
app.get "/write/:id", routes.write.get
app.get "/api/community/:id", routes.community.api.get
app.get "/api/feed/multi/:from?/:to", routes.feed.api.multi
app.get "/api/feed/:community/:type/:from?/:to", routes.feed.api.get

app.post "/create-community", routes.community.post
app.post "/new-feed/:id", routes.write.newFeed

# development only
app.use express.errorHandler()  if "development" is app.get("env")
http.createServer(app).listen app.get("port"), ->
  console.log "Express server listening on port " + app.get("port")