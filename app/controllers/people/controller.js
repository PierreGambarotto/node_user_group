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
        res.format({
          html: function(){ 
            res.render('index',{users: users})
          },
          json: function(){
            res.json(users)
          }
        })
      })
    },

    // GET /people/new
    'new': function(req, res){
      res.render('new', { user: new User()})
    },

    // POST /people
    create: function(req, res){
      User.create(req.body.user, function(err,user){
        if (err) {
          res.format({
            html: function(){
              // user = User.new.merge req.body.user
              res.render('new', { user: req.body.user})
            },
            json: function(){
              if (err.errors && err.errors.login && err.errors.login.message === 'Login is already taken') {
                res.set('Location', "/people/" + req.body.user.login)
                res.send(303)
              } else {
                res.send(400)
              }
            }
          })
        } else {
          res.format({
            json: function(){
              res.set('Location', '/people/'+ user.login)
              res.send(201)
            },
            html: function(){
              res.redirect('/people')
            }
          })
        }
      })
    }

  }

  var express = require('express')
  var app = express()
  app.models = parent.models
  controller.app = app
  app.use(express.urlencoded())
  app.use(express.json())
  app.set('views', __dirname + '/views')
  parent.use(app)
  return controller
}
