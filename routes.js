module.exports = function(app){
  // user routes
  route('get', '/people', 'people', 'index')
  route('get', '/people/new', 'people', 'new')
  route('get', '/people/:login', 'people', 'show')
  route('get', '/people/:login/edit', 'people', 'edit')
  route('post', '/people', 'people', 'create')
  route('post', '/people/:login', 'people', 'update')

  function route(verb, path, controller, method){
    app.controllers[controller].app[verb](path, app.controllers[controller][method])
  }

}
