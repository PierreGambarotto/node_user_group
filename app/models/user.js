require('../../lib/object')
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
// retrieve group's subscription
// cb is called with the result
// result = { group1: true|false, group2: true|false …}
// true: user is membrer of the group
// false: user is not member of the group
userSchema.methods.get_subscription = function(cb){
  var self = this
  Group.find({}, function(err, groups){
    if (err) return cb(err)
    var subscription = {}
    var user_groups_ids
    user_groups_ids = self.populated('groups') || self.groups
    user_groups_ids = user_groups_ids.map(function(id){return id.toString()})
    groups.forEach(function(group){
      if (user_groups_ids.indexOf(group.id) != -1){
        subscription[group.name] = true
      } else {
        subscription[group.name] = false
      }
    })
    cb(null,subscription)
  })
}
userSchema.methods.set_subscription = function(groups,cb){
  var self = this
  var groups_to_subscribe
  self.groups = []
  if (typeof groups === 'string') {
    groups_to_subscribe = [ groups ]
  } else if(typeof groups === 'undefined') {
    return self.save(cb)
  } else {
    groups_to_subscribe = groups
  }
  Group.find({name: {$in: groups_to_subscribe}},'_id', function(err, groups){
    if (err) return cb(err)
    groups.forEach(function(group){
      self.groups.push(group.id)
    })
    self.save(cb)
  })
}

// add a static method
userSchema.statics.listAdministartors = function(callback) {
  this.find({ admin: true}, callback);
}
userSchema.statics.findByIdAndUpdateWithGroups = function(id,modifications,cb){
  var mods = modifications.filter('firstname', 'lastname')
  this.model('User').findByIdAndUpdate(id, mods, function(err, res){
    if (err) throw(err)
    res.set_subscription(modifications.groups, cb)

  })
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

