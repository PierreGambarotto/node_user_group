var server = "http://localhost:3001"

var request = require('superagent').agent()
// create some initial users to play with
// we use the REST API
for (var i=1;i<=4;i++){
  var new_user = {
    login: 'login' + i,
    firstname: 'f' + i,
    lastname: 'l' + i,
    password: 'pass' + i
  }
  request
    .post(server + '/people')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send({user: new_user})
    .end(function(err,res){
      if (err) throw(err)
      if (res.status !== 201) {
        console.log('fixture creation problem, http status: ' + res.status)
      }
    })
}
