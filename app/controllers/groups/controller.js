function inspect(obj, depth){
  if (depth === undefined) depth = 1
  console.log(">>>> " + require('util').inspect(obj, {depth: depth}))
}

module.exports = function(parent) {
  var controller = {
    // GET /groups
    index: function(req, res){
      res.send("list of groups")
    }
  }

  var express = require('express')
  var app = express()
  var connect = require('connect')
  app.models = parent.models
  controller.app = app
  app.use(express.urlencoded())
  app.use(express.json())
  app.use(connect.methodOverride())
  app.set('views', __dirname + '/views')
  app.param('login', function(req, res, next, id){
    User.findOne({login: id}, function(err, user){
      if(err) {
        next(err)
      } else if (user) {
        req.user = user.toObject()
        next()
      } else {
        res.send(404, "User not found")
      }
    })
  })
  parent.use(app)
  return controller
}
