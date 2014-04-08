function middleware_test(req, res, next){
  if (req.test) {
    req.test = 'the middleware test has been called again'
  } else {
    req.test = 'the middleware test has been called'
  }
  next()
}
// middleware to ensure a user is logged in
function isLoggedIn(req, res, next) {
  // req.isAuthenticated is given by passport 
  if (req.isAuthenticated())
    return next();

  res.redirect('/session/new');
}
module.exports = function(app){
  // authentication
  route('get', '/session/new', 'auth', 'new')
  route('post', '/session', 'auth', 'create')
  // user routes
  route('get', '/people', 'people', 'index', [middleware_test, middleware_test, isLoggedIn])
  route('get', '/people/new', 'people', 'new')
  route('get', '/people/:login', 'people', 'show')
  route('get', '/people/:login/edit', 'people', 'edit')
  route('post', '/people', 'people', 'create')
  route('patch', '/people/:login', 'people', 'update')

  route('get', '/groups', 'groups', 'index')
  function route(verb, path, controller, method, middleware){
    if (typeof middleware === 'undefined') {
      app.controllers[controller].app[verb](path, app.controllers[controller][method])
    } else if (typeof middleware === 'function') {
      app.controllers[controller].app[verb](path, middleware, app.controllers[controller][method])
    } else if (middleware instanceof Array) {
      var args = [ path ].concat(middleware).concat(app.controllers[controller][method])
      app.controllers[controller].app[verb].apply(app.controllers[controller].app, args)
    }

  }

}
