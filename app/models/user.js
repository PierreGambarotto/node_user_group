var mongoose = require('mongoose');

// Schema definition with some validation
var userSchema = mongoose.Schema({
  lastname: { type: String, required: true}
  , firstname: { type: String, required: true}
  , login: {type: String, required: true}
  , password : {type: String, required: true}
  , admin: {type: Boolean, default: false}
});

// add an instance method
userSchema.methods.fullname = function(){ return this.firstname + ' ' + this.lastname;};

// add a static method
userSchema.static.listAdministartors = function(callback) {
  this.find({ admin: true}, callback);
}
// compile schema to create a model
var User = mongoose.model('User', userSchema);

// custom validation rules
User.schema.path('login').validate(login_is_unique, "Login is already taken");

function login_is_unique(login,callback) {
  User.find({login: login}, function(err, logins){
   callback(err || logins.length === 0);
  });
}
module.exports = mongoose.model('User');

