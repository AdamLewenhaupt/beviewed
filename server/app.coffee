
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
		routes.community.fetchCommunities collections.communities
		timers.setInterval ( () -> routes.community.log() ), 86400000

# all environments
app.engine "html", require('ejs').renderFile
app.set "port", process.env.PORT or 3000
app.set "views", __dirname + "/views"
app.set "view engine", "ejs"
app.use express.favicon()
app.use express.logger("dev")
app.use express.bodyParser()
app.use express.methodOverride()
app.use app.router
app.use express.static(path.join(__dirname, "client"))

app.get "/", routes.index.get
app.get "/profile", routes.profile.get
app.get "/community/:id", routes.community.get
app.get "/explore", routes.explore.get
app.get "/dashboard", routes.dashboard.get
app.get "/create-community", routes["create-community"].get

# development only
app.use express.errorHandler()  if "development" is app.get("env")
http.createServer(app).listen app.get("port"), ->
  console.log "Express server listening on port " + app.get("port")