var mocha = require('mocha')
var sinon = require('sinon')

var add_testing_helpers = require('../../lib/controller_testing_helpers')
var app = require('express')()
app.models = {}
app.models.User = function(){}
app.models.User.create = function(){}
app.models.User.find = function(){}
app.models.User.findOne = function(){}
app.models.User.update = function(){}

var User = app.models.User
var controller = require('../../app/controllers/people/controller')(app)
var controller = add_testing_helpers(controller)

var req, res;

beforeEach(function(){
  req = {}
  req.params = {}
  res = {
    format: function(obj){
      obj.html(req, this)
    },
    redirect: function(){},
    render: function(){},
    send: function(){}
  }
  req.res = res
  res.req = req
})
describe('people controller', function(){
  describe('#index', function(){
    it('searches users in the database', function(){
      var mock = sinon.mock(User)
      mock.expects('find').once()
      controller.index(req,res)
      mock.verify()
      mock.restore()

    })
    it('renders index template with an array of users', function() {
      var stub = sinon.stub(User, 'find')
      var users = [{login: 'user1'}, {login: 'user2'}]
      stub.callsArgWith(0, undefined, users)
      controller.index.should_render('index',{users: users}, req)
      stub.restore()
    })
  })
  describe('#show', function(){
    beforeEach(function(){
      req.params.login = 'bob'
      req.user = {login: 'bob', firstname: 'f', lastname: 'l', password: 'do not show'}
    })
    it('only displays login, firstname and lastname', function(){
      var mock = sinon.mock(req.user)
      mock.expects('filter').once().withExactArgs('login', 'firstname', 'lastname')
      controller.show(req, res)
      mock.verify()
      mock.restore()

    })
    it('renders the show view with the user', function(){
      controller.show.should_render('show', {user: {login: 'bob', firstname: 'f', lastname: 'l'} }, req)
    })
  })
  describe('#edit', function(){
    var filtered_user = {login: 'bob', firstname: 'f', lastname: 'l'}
    beforeEach(function(){
      req.params.login = 'bob'
      req.user = {login: 'bob', firstname: 'f', lastname: 'l', password: 'do not show'}
    })
    it('only displays login, firstname and lastname', function(){
      var mock = sinon.mock(req.user)
      mock.expects('filter').once().withExactArgs('firstname', 'lastname')
      controller.show(req, res)
      mock.verify()
      mock.restore()
    })
    it('renders the edit view with the user', function(){
      controller.edit.should_render('edit', {user: filtered_user}, req)
    })
  })  
  describe('#update', function(){
    beforeEach(function(){
      req.params.login = 'bob'
      req.body = {}
      req.body.user = { lastname: 'modl', firstname: 'modf', other: 'not wanted param' }
    })
    it('selects valid arguments from request body', function(){
      var mock = sinon.mock(req.body.user)
      mock.expects('filter').withExactArgs('firstname', 'lastname')
      controller.update(req, res)
      mock.verify()
      mock.restore()

    })
    it('updates the user with arguments in body', function(){
      var mock = sinon.mock(User)
      mock.expects('update').withArgs({login: req.params.login}, {lastname: req.body.user.lastname, firstname: req.body.user.firstname})
      controller.update(req, res)     
      mock.verify()
      mock.restore()
    })
    it('redirect to the show view of the user', function(){
      var stub = sinon.stub(User, 'update')
      stub.callsArgWith(2, undefined, {firstname: 'modf', lastname: 'modl'})
      controller.update.should_redirect_to('/people/'+ req.params.login, req)
      stub.restore()

    })
  })
  describe('#new', function(){
    it('renders the new template with a blank user', function(){
      controller.new.should_render('new', {user:{}})
    })
  })
  describe('#create', function(){
    beforeEach(function(){
      req.body = {}
      req.body.user = { lastname: 'last', firstname: 'first', login: 'logid', password: 'pass' }
    })
    it('tries to create a new user from body parameters', function(){
      var mock = sinon.mock(User)
      mock.expects('create').withArgs(req.body.user)
      controller.create(req,res)
      mock.verify()
      mock.restore()
    })
    context('when creation is successful', function(){
      var stub
      beforeEach(function(){
        stub = sinon.stub(User, 'create')
        // User.create(obj, function(err, res){…})
        stub.callsArgWith(1, undefined)
      })
      it('redirects to the list page', function(){
        controller.create.should_redirect_to('/people', req)
      })
      afterEach(function(){
        stub.restore()
      })

    })
    context('when creation does not work', function(){
      var stub
      beforeEach(function(){
        stub = sinon.stub(User, 'create')
        // User.create(obj, function(err, res){…})
        stub.callsArgWith(1, "error")
      })
      it('renders the new template with previously entered values', function(){
        controller.create.should_render('new', { user: req.body.user}, req)
      })
      afterEach(function(){
        stub.restore()
      })
    })
  })
})
