var mocha = require('mocha')
var sinon = require('sinon')

var add_testing_helpers = require('../../lib/controller_testing_helpers')
var app = require('express')()
app.models = {}
app.models.User = function(){}
app.models.User.create = function(){}
app.models.User.find = function(){}

var User = app.models.User
var controller = require('../../app/controllers/people/controller')(app)
var controller = add_testing_helpers(controller)

var req, res;

beforeEach(function(){
  req = {}
  res = {
    redirect: function(){},
    render: function(){}
  }
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
      controller.index.should_render('index',{users: users})
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
