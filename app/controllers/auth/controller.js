function inspect(obj, depth){
  if (depth === undefined) depth = 1
  console.log(">>>> " + require('util').inspect(obj, {depth: depth}))
}

module.exports = function(parent) {
  var passport = require('passport')
  var LocalStrategy = require('passport-local').Strategy
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  })

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  })
  passport.use(new LocalStrategy({ usernameField: 'login'},
    function(login, password, done){
      User.findOne({login: login}, function(err, user){
        if (err) return done(err)
        if (!user) return done(null, false, { message: 'utilisateur inconnu' })
        if (user.password != password){
          return done(null, false, { message: 'mauvais identifiant' })
        }
        return done(null, user)
      })
    }
  ))
  var controller = {
    // GET /session/new
    'new': function(req, res){
      res.render('new')
    },
    // POST /session
    create: passport.authenticate('local', { 
        successRedirect: '/people', 
        failureRedirect: '/session/new'
    })
  }

  var express = require('express')
  var app = express()
  app.models = parent.models
  var User = app.models.User
  var connect = require('connect')
  controller.app = app
  app.set('views', __dirname + '/views')
  // midddlewares
  app.use(express.bodyParser()) // decode html forms automagically
  // authentication via passport
  app.use(passport.initialize())
  app.use(passport.session())
  parent.use(app)
  return controller
}
