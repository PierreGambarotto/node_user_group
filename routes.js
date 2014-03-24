module.exports = function(app){
  // user routes
  route('get', '/people', 'people', 'index')
  route('get', '/people/new', 'people', 'new')
  route('post', '/people', 'people', 'create')
  route('get', '/people/:login', 'people', 'show')







  function route(verb, path, controller, method){
    app.controllers[controller].app[verb](path, app.controllers[controller][method])
  }

}
