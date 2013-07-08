
###
Module dependencies.
###
express = require("express")
http = require("http")
path = require("path")
routes = require('./routes')
swoosh = require('swoosh')
app = express()

swoosh (path.join __dirname, "swoosh.yml"), (err, collections) ->
	if err
		console.log "Swoosh err:", err
	else
		this.route(app)

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

# development only
app.use express.errorHandler()  if "development" is app.get("env")
http.createServer(app).listen app.get("port"), ->
  console.log "Express server listening on port " + app.get("port")