var express = require('express')
var app = express()
module.exports = app
var fs = require('fs')
var path = require('path')
var util = require('util')
var mongoose = require('mongoose')

var port = { development: 3000, test: 3001 }
app.set('db', 'user_group_' + app.get('env'))
app.set('db_url', 'mongodb://localhost/' + app.get('db'))
app.set('port', process.env.PORT || port[app.get('env')] || 3000)
app.set('view engine', 'jade')
app.set('views', __dirname + '/app/views')
app.use(app.router)
app.use(express.static(path.join(__dirname, 'public')))
// models
app.models = {}
var models = app.models
fs.readdirSync(__dirname + '/app/models').forEach(function(model_file){
  if (path.extname(model_file) === '.js') {
    var model = require(__dirname + '/app/models/' + model_file)
    models[model.modelName] = model 
  }
})
// controllers
app.controllers = {}
var controllers = app.controllers
fs.readdirSync(__dirname + '/app/controllers').forEach(function(controller_directory){
  var controller_file = __dirname + '/app/controllers/' + controller_directory + '/controller.js'
  var controller_name = path.basename(controller_directory)
  if (fs.existsSync(controller_file)) {
    controllers[controller_name] = require(controller_file)(app)
  }
})

// routing
require('./routes')(app)

// 404 handler
app.use(function(req,res){
  res.send(404,'404: Page not found')
})

// database connection
mongoose.connect(app.get('db_url'), function(err){
  if (err) console.log('Mongoose - connection error: ' + err)
  console.log('Mongoose - connection Ok')
})
// launch application
mongoose.connection.once('open', function(){
  app.listen(app.get('port'))
  console.log('listening on port ' + app.get('port') + ' in ' + app.get('env') + ' environment')
})
