// connect to mongodb://localhost/node_users_test
// empty database before each test

var mongoose = require('mongoose'),
    should = require('should'),
    sinon = require('sinon'),
    dbURI = 'mongodb://localhost/node_users_test',
    User = require('../../app/models/user.js')
;
before(function(done){
  // connect to db
  mongoose.connect(dbURI);
  // remove all documents
  mongoose.connection.on('open', function(){
    User.remove(function(err, users){
      if(err){
        console.log(err); 
        throw(err);
      } else {
        // console.log('cleaning users from mongo');
        done();
      }
      
    })
  })
})
afterEach(function(done){
  User.remove().exec(done);
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
      User.find({login: 'bob'}, function(err, logins){
        user = new User(user)
        user.validate(function(err){
          err.should.have.property('errors')
          err.errors.should.have.property('login')
          err.errors.login.should.have.property('message', 'Login is already taken')
          done()
        })
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
