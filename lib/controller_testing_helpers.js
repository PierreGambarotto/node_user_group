var sinon = require('sinon')
var req, res
req = {}
res = {
  redirect: function(){},
  render: function(){}
}

var should_render = function should_render(view, context, _req) {
  if (_req === undefined) _req = req
  var mock = sinon.mock(res)
  if (context === undefined) {
    mock.expects('render').withExactArgs(view)
  } else {
    mock.expects('render').withExactArgs(view, context)
  }
  this.apply(this, [_req,res])
  mock.verify()
  mock.restore()
}

var should_redirect_to = function(path, _req){
  if (_req === undefined) _req = req
  var mock = sinon.mock(res)
  mock.expects('redirect').withExactArgs(path)
  this.apply(this, [_req, res])
  mock.verify()
  mock.restore()
}

var should_call = function (object, method, args, _req){
  if (_req === undefined) _req = req
  var mock = sinon.mock(object)
  mock.expects(method).withExactArgs(args)
  this.apply(this, [_req, res])
  mock.verify()
  mock.restore()
}

var add_helpers = function(controller_object){
  for (var prop in controller_object) {
    if (~['app'].indexOf(prop)) continue
    if (typeof controller_object[prop] === 'function') {
      controller_object[prop].should_render = should_render
      controller_object[prop].should_call = should_call
      controller_object[prop].should_redirect_to = should_redirect_to
    } 
  }
  return controller_object
}

module.exports = add_helpers
