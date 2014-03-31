require('../../../lib/object')

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

    // GET /people/:login
    show: function(req, res) {
      res.format({
        html: function(){
          res.render('show', {user: req.user.filter('login', 'firstname', 'lastname')})
        },
        json: function(){
          res.json(req.user)
        }
      })
    },

    // GET /people/new
    'new': function(req, res){
      res.render('new', { user: new User()})
    },

    // GET /people/:login/edit
    edit: function(req, res) {
      res.render('edit', {user: req.user.filter('login', 'firstname', 'lastname')})
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
    },

    // PATCH /people/:login
    update: function(req, res){
      var mods = {}
      // select only firstname and lastname modification
      mods = req.body.user.filter('lastname', 'firstname')
      User.update({login: req.params.login}, mods, function(err, user){
        if (err) {
          next(err)
        } else {
          res.redirect('/people/' + req.params.login)
        }
      })
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
