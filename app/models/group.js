var mongoose = require('mongoose');

var groupSchema = mongoose.Schema({
  name: { type: String, required: true}
});

var Group = mongoose.model('Group', groupSchema);

Group.schema.path('name').validate(name_is_unique, 'Name is already taken')

function name_is_unique(name, callback){
  Group.find({name: name, _id: {$ne: this.id}}, function(err, groups){
    callback(err || groups.length === 0)
  })
}
module.exports = mongoose.model('Group');

