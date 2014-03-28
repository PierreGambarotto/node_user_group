var server = "http://localhost:3001"

casper.test.begin('To edit the user "login2"', function(test){
  casper.start(server + '/people/login2', function(){
    test.assertHttpStatus(200, 'from the show page')
  })

  casper.then(function(){
    this.echo('I click the edit link corresponding to this user')
    this.click('a[href="/people/login2/edit"]')
  })

  casper.then(function(){
    test.assertHttpStatus(200, 'I reach a new page')
    test.assertUrlMatch(server + '/people/login2/edit', 'its url is /people/login2/edit')
  })

  casper.then(function(){
    this.echo('I replace the firstname with Edward')
    this.echo('I replace the lastname with CissorHand')
    this.fill('form#edit_user_login2', {
      'user[firstname]': 'Edward',
      'user[lastname]':  'CissorHand'
    }, true) // true submit
  })

  casper.then(function(){
    test.assertUrlMatch(server + '/people/login2', 'I get back the show page')
    test.assertTextExists('Edward', 'with the new firstname')
    test.assertTextExists('CissorHand', 'and the new lastname')
  })
  casper.run(function(){
    test.done()
  })
})

