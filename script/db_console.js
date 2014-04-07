var express = require('express')
var app = express()
module.exports = app
var fs = require('fs')
var path = require('path')
var util = require('util')
var mongoose = require('mongoose')

app.set('db', 'user_group_' + app.get('env'))
app.set('db_url', 'mongodb://localhost/' + app.get('db'))
// models
app.models = {}
var models = app.models
fs.readdirSync(__dirname + '/../app/models').forEach(function(model_file){
  if (path.extname(model_file) === '.js') {
    var model = require(__dirname + '/../app/models/' + model_file)
    models[model.modelName] = model 
  }
})
// database connection
mongoose.connect(app.get('db_url'), function(err){
  if (err) console.log('Mongoose - connection error: ' + err)
  console.log('Mongoose - connection Ok')
})
// launch application
var repl = require('repl')
mongoose.connection.once('open', function(){
  var prompt = repl.start({prompt: app.get('db')+' > ', useGlobal: true})
  .on('exit', function(){process.exit()})
  Object.keys(models).forEach(function(model_name){
    prompt.context[model_name] = models[model_name]
  })
})
