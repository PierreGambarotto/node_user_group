// connect to mongodb://localhost/node_users_test
// empty database before each test

var mongoose = require('mongoose'),
    should = require('should'),
    sinon = require('sinon'),
    dbURI = 'mongodb://localhost/node_users_test',
    User = require('../../app/models/user.js')
    Group = require('../../app/models/group.js')
;
before(function(done){
  // connect to db
  if (mongoose.connection.db) return done();
  mongoose.connect(dbURI);
  done()
})
beforeEach(function(done){
  User.remove().exec(function(){
    Group.remove().exec(done)
  })
})

describe('an instance of User', function(){
  var user;
  beforeEach(function(done){
    user = new User({firstname: 'bob', lastname: 'éponge', login: 'bob', password: 'passbob'})
    user.save(function(err){
      if(err){throw(err);}
      done();
    })
  })
  it('has a lastname', function(){
    user.lastname.should.eql('éponge');
  })
  it('has a firstname', function(){
    user.firstname.should.eql('bob');
  })
  it('has a login', function(){
    user.login.should.eql('bob');
  })
  it('has a password',function(){
    user.password.should.eql('passbob');
  })
  it('is not admin by default', function(){
    user.admin.should.be.false
  })
  it('can become admin', function(){
    user.admin = true
    user.admin.should.be.true
  })

  it('can be retrieved from db with his login', function(done){
    User.findOne({login: user.login}, function(err,retrieved_user){
      if(err){throw(err)}
      [ 'firstname', 'lastname', 'login', 'password', 'admin'].forEach(function(attr){
        user[attr].should.eql(retrieved_user[attr])
      })
        
      done()
    })
  })

  it('has a unique _id attribute', function(){
     user.should.have.property('_id')
  })
})

// validation stuff
describe('an instance of User', function(){
  var user, valid_user;
  beforeEach(function(){
    user = {firstname: 'tom', lastname: 'éponge', login: 'bob', password: 'passbob'}
    Object.defineProperty(user, 'is_invalid_without', {
      value: function(attr){
        delete this[attr]
        var invalid = new User(this)
        invalid.validate(function(err){
          err.should.have.property('errors')
          err.errors.should.have.property(attr)
        })
      }
    })
  })
  it('is not valid if login is already taken', function(done){
    valid_user = new User({firstname: 'toto', lastname: 'titi', password: 'passtoto', login: user.login})
    valid_user.save(function(err,u){
      if(err){done(err)} 
      user = new User(user)
      user.login = u.login
      user.validate(function(err){
        should.exist(err)
        err.should.have.property('errors')
        err.errors.should.have.property('login')
        err.errors.login.should.have.property('message', 'Login is already taken')
        done()
      })
    })
  })
  it('is not valid without a firstname', function(){
    user.is_invalid_without('firstname')
  })
  it('is not valid without a lastname', function(){
    user.is_invalid_without('lastname')
  })
  it('is not valid without a login', function(){
    user.is_invalid_without('login')
  })
  it('is not valid without a password', function(){
    user.is_invalid_without('password')
  })
})

// user together with groups
describe('an User with groups', function(){
  // creates an user with 2 groups : group1 and group2
  // user doesn't belong to group3 
  var user,group1, group2, group3
  beforeEach(function(done){
    Group.create({name: 'group1'}, function(err, group){
      if (err) throw(err)
      group1 = group
      done()
    })
  })
  beforeEach(function(done){
    Group.create({name: 'group2'}, function(err, group){
      if (err) throw(err)
      group2 = group
      done()
    })
  })
  beforeEach(function(done){
    Group.create({name: 'group3'}, function(err, group){
      if (err) throw(err)
      group3 = group
      done()
    })
  })
  beforeEach(function(done){
    user = new User({firstname: 'bob', lastname: 'éponge', login: 'bob', password: 'passbob'})
    user.groups.push(group1)
    user.groups.push(group2)
    user.save(function(err, u){
      if (err) throw(err)
      done()
    })
  })
  it('has two groups', function(){
    user.groups.length.should.eql(2)
  })

  it('stores groups as reference', function(){
    user.groups[0].toString().should.eql(group1.id)
    user.groups[1].toString().should.eql(group2.id)
  })
  describe('User#get_subscription', function(){
    it('returns an object with true or false for each group name', function(done){
      user.get_subscription(function(subs){
        subs.should.eql({ group1: true, group2: true, group3: false})
        done()
      })
    })
  })
  describe('User#set_subscription', function(){
    it('sets groups to the given list', function(done){
      user.set_subscription(['group1', 'group3'], function(err, res){
        res.get_subscription(function(subs){
          subs.should.eql({ group1: true, group2: false, group3: true})
          done()
        })
      })
    })
  })
})
