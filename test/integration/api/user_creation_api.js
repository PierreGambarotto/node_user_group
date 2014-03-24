process.env.NODE_ENV = 'test';
var app = require('../../../app');
var request = require('supertest')(app);
var should = require('should');
var mongoose = require('mongoose');
var User = mongoose.model('User');

before(function(done) {
  mongoose.connection.on('open', function() {
    User.remove(function(err, users) {
      if (err) {
        console.log(err);
        throw err;
      } else {
        console.log('cleaning user from mongo');
        done();
      }
    });
  });
});

afterEach(function(done) {
  User.remove().exec(done);
});

describe('user JSON API ', function() {
  describe('GET /people', function() {
    it('returns a JSON document', function(done) {
      request.get('/people').set('Accept', 'application/json').expect('Content-Type', /json/, done);
    });
    it('returns an ok status', function(done) {
      request.get('/people').set('Accept', 'application/json').expect(200, done);
    });
    it('returns an array', function(done) {
      request.get('/people').set('Accept', 'application/json').end(function(err, res) {
        var users;
        users = res.body;
        users.should.be.an.instanceOf(Array);
        done();
      });
    });
    context('when no user exist', function() {
      it('returns an empty array', function(done) {
        request.get('/people').set('Accept', 'application/json').end(function(err, res) {
          var users;
          users = res.body;
          users.should.be.empty;
          done();
        });
      });
    });
    context('when 3 users exist', function() {
      beforeEach(function(done) {
        User.create({
          lastname: 'l1',
          firstname: 'f1',
          login: 'login1',
          password: 'pass1'
        }, {
          lastname: 'l2',
          firstname: 'f2',
          login: 'login2',
          password: 'pass2'
        }, {
          lastname: 'l3',
          firstname: 'f3',
          login: 'login3',
          password: 'pass3'
        }, function() {
          done();
        });
      });
      it('returns an array with 3 elements', function(done) {
        request.get('/people').set('Accept', 'application/json').end(function(err, res) {
          res.body.should.have.a.lengthOf(3);
          done();
        });
      });
    });
  });
  describe('POST /people', function() {
    context('when a valid user is given as a json document', function() {
      var create_user_request, new_user;
      new_user = {
          lastname: 'l',
          firstname: 'f',
          login: 'login',
          password: 'pass'
      };
      create_user_request = null;
      beforeEach(function() {
       create_user_request = request
         .post('/people')
         .set('Accept', 'application/json')
         .set('Content-Type', 'application/json')
          .send({user: new_user});
      });
      it('returns 201 Created status', function(done) {
        create_user_request.expect(201, done);
      });
      it('sets Location header to new user', function(done) {
        create_user_request.expect('Location', /people\/login/, done);
      });
      it('creates a new user', function(done) {
        create_user_request.end(function(err, res) {
          if (err) {
            done(err);
          }
          User.count(new_user, function(err, count) {
            if (err) {
              done(err);
            }
            count.should.equal(1);
            done();
          });
        });
      });
    });
    context('when an invalid user is given', function() {
      it('returns a 400 error', function(done) {
        var invalid_new_user = {
          wrong: 'so wrong'
        };
        request
          .post('/people')
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .send({user: invalid_new_user})
          .expect(400, done);
      });
    });
    context('when the user already exists', function() {
      it('redirects to the user', function(done) {
        var existing_user = {
          lastname: 'l',
          firstname: 'f',
          login: 'login',
          password: 'pass'
        };
        User.create(existing_user, function(err,user){
          if (err) done(err)
          request
            .post('/people')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({user: existing_user}).expect(303)
            .expect('Location', "/people/" + existing_user.login, done);
        })
      });
    });
  });
  describe('DELETE /people/:id', function() {
    context('when the user exists', function() {
      it('removes it', function(done) {
        var user;
        user = {
          lastname: 'l',
          firstname: 'f',
          login: 'login',
          password: 'pass'
        };
        User.create(user);
        request.del("/people/" + user.login)
          .set('Accept', 'application/json')
          .expect(200).end(function(err, res) {
          if (err) {
            done(err);
          }
          User.count(user, function(err, count) {
            if (err) {
              done(err);
            }
            count.should.equal(0);
            done();
          });
        });
      });
    });
    context('when the user doe not exist', function() {
      it('returns a 404 User not found', function(done) {
        request.del('/people/missing')
          .set('Accept', 'application/json')
          .expect(404, 'User not found', done);
      });
    });
  });
  describe('GET /people/:id', function() {
    context('when the user exists', function() {
      it('returns it', function(done) {
        var user;
        user = {
          lastname: 'l',
          firstname: 'f',
          login: 'login',
          password: 'pass'
        };
        User.create(user);
        request.get("/people/" + user.login)
          .set('Accept', 'application/json')
          .expect(200).end(function(err, res) {
          if (err) {
            done(err);
          }
          res.body.login.should.equal('login');
          done();
        });
      });
    });
    context('when the user doe not exist', function() {
      it('returns a 404 User not found', function(done) {
        request
          .get('/people/missing')
          .set('Accept', 'application/json')
          .expect(404, 'User not found', done);
      });
    });
  });
});
