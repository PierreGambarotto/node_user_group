// connect to mongodb://localhost/node_users_test
// empty database before each test

var mongoose = require('mongoose'),
    should = require('should'),
    sinon = require('sinon'),
    dbURI = 'mongodb://localhost/node_users_test',
    Group = require('../../app/models/group.js')
;
before(function(done){
  // connect to db
  if (mongoose.connection.db) return done();
  mongoose.connect(dbURI);
  done()
})
beforeEach(function(done){
  Group.remove().exec(done);
})

describe('an instance of Group', function(){
  var group;
  beforeEach(function(done){
    group = new Group({name: 'g'})
    group.save(function(err){
      if(err){throw(err);}
      done();
    })
  })
  it('has a name', function(){
    group.name.should.eql('g');
  })
  it('can be retrieved from db with its name', function(done){
    Group.findOne({name: group.name}, function(err,retrieved_group){
      if(err){throw(err)}
      group.name.should.eql(retrieved_group.name)
      done()
    })
  })

  it('has a unique _id attribute', function(){
     group.should.have.property('_id')
  })
})

describe('an instance of Group', function(){
  var group, valid_group;
  beforeEach(function(){
    group = {name: 'sample group'}
    Object.defineProperty(group, 'is_invalid_without', {
      value: function(attr){
        delete this[attr]
        var invalid = new Group(this)
        invalid.validate(function(err){
          err.should.have.property('errors')
          err.errors.should.have.property(attr)
        })
      }
    })
  })
  it('is not valid if name is already taken', function(done){
    valid_group = new Group(group)
    valid_group.save(function(err,u){
      if(err){done(err)} 
      group = new Group(group)
      group.validate(function(err){
        should.exist(err)
        err.should.have.property('errors')
        err.errors.should.have.property('name')
        err.errors.name.should.have.property('message', 'Name is already taken')
        done()
      })
    })
  })
  it('is not valid without a name', function(){
    group.is_invalid_without('name')
  })
})
