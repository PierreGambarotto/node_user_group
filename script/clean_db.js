var express = require('express')
var app = express()
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
  if (path.extname(model_file) === '.js') 
    var model = require(__dirname + '/../app/models/' + model_file)
    models[model.modelName] = model 
})
// database connection
mongoose.connect(app.get('db_url'), function(err){
  if (err) console.log('Mongoose - connection error: ' + err)
  console.log('Mongoose - connection Ok')
})
// launch script
mongoose.connection.once('open', function(){
  console.log('cleaning ' + app.get('db') )
  for (var model in app.models) {
    console.log(model)
    app.models[model].remove({}, function(err, m){
      console.log(err)
      console.log('delete ' + m)
    })
  }
  process.exit(0)
})
