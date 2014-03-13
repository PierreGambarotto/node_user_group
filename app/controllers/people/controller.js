function inspect(obj, depth){
  if (depth === undefined) depth = 1
  console.log(">>>> " + require('util').inspect(obj, {depth: depth}))
}
module.exports = function(parent) {
  var User = parent.models.User
  var controller = {
    // GET /people
    index: function(req, res){
      User.find(function(err, users){
        res.render('index',{users: users})
      })
    },

    // GET /people/new
    'new': function(req, res){
      res.render('new', { user: new User()})
    },

    // POST /people
    create: function(req, res){
      User.create(req.body.user, function(err){
        if (err) {
          res.render('new', { user: req.body.user})
        } else {
          res.redirect('/people')
        }
      })
    }

  }

  var express = require('express')
  var app = express()
  app.models = parent.models
  controller.app = app
  app.use(express.urlencoded())
  app.set('views', __dirname + '/views')
  parent.use(app)
  return controller
}
