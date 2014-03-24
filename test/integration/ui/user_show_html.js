var server = "http://localhost:3001"

// fixture : 4 users already exists, login1 to login4
// login2 : {firstname: 'f2', lastname. 'l2', login: 'login2', password: 'pass2'}
casper.test.begin('To display detailed information on a user', function(test){
  casper.start(server + '/people/', function(){
    test.assertHttpStatus(200, 'from the list page')
  })

  casper.then(function(){
    this.echo('I click on the second user with login login2')
    this.click('a[href="/people/login2"]')
  })

  casper.then(function(){
    test.assertHttpStatus(200, 'I reach a new page')
    test.assertUrlMatch(server + '/people/login2', 'its url is /people/login2')
    test.assertTextExists('f2', 'the firstname is displayed')
    test.assertTextExists('l2', 'the lastname is displayed')
    test.assertTextDoesntExist('pass2', 'the password is NOT displayed')
  })


  casper.run(function(){
    test.done()
  })

})

