var mongoose = require('mongoose');

var Group = require('./group')
// Schema definition with some validation
var userSchema = mongoose.Schema({
  lastname: { type: String, required: true}
  , firstname: { type: String, required: true}
  , login: {type: String, required: true}
  , password : {type: String, required: true}
  , admin: {type: Boolean, default: false}
  , groups: [{ type: mongoose.Schema.Types.ObjectId, ref:  'Group'}]
});

// instance methods
userSchema.methods.fullname = function(){ return this.firstname + ' ' + this.lastname;};
userSchema.methods.set_subscription = function(groups,cb){
  var self = this
  self.groups = []
  Group.find({name: {$in: groups}},'_id', function(err, groups){
    groups.forEach(function(group){
      self.groups.push(group.id)
    })
    self.save(cb)
  })
}
// retrieve group's subscription
// cb is called with the result
// result = { group1: true|false, group2: true|false …}
// true: user is membrer of the group
// false: user is not member of the group
userSchema.methods.get_subscription = function(cb){
  var self = this
  Group.find({}, function(err, groups){
    if (err) throw(err)
    var subscription = {}
    groups.forEach(function(group){
      if (self.groups.indexOf(group.id) != -1){
        subscription[group.name] = true
      } else {
        subscription[group.name] = false
      }
    })
    cb(subscription)
  })
}

// add a static method
userSchema.static.listAdministartors = function(callback) {
  this.find({ admin: true}, callback);
}
// compile schema to create a model
var User = mongoose.model('User', userSchema);

// custom validation rules
User.schema.path('login').validate(login_is_unique, "Login is already taken");

function login_is_unique(login,callback) {
  User.find({login: login, _id: { $ne: this.id}}, function(err, logins){
    callback(err || logins.length === 0);
  });
}
module.exports = mongoose.model('User');

