var server = "http://localhost:3001"

casper.test.begin('To create a new user', function(test) {
  casper.start(server + '/people/', function(){
    test.assertHttpStatus(200, 'from the list page')
    test.assertExists('a[href="/people/new"]', 'exists a link to create a new user')
  })


  casper.then(function(){
    this.echo('after I click the link')
    this.click('a[href="/people/new"]')
  })

  casper.then(function(){
    test.assertHttpStatus(200, 'I reach a new page')
    test.assertUrlMatch(server + '/people/new', 'its url is /people/new')
    test.assertExists('form#new_user', 'I found a form to create a new user')
  })

  casper.then(function(){
    this.echo('I fill in the form')
    this.fill('form#new_user', {
      'user[lastname]': 'Éponge',
      'user[firstname]': 'Bob',
      'user[login]': 'bob',
      'user[password]': 'passbob'
    }, true) // true : submit form
  })
  casper.then(function(){
    test.assertHttpStatus(200, 'I reach a new page ')
    test.assertUrlMatch(server + '/people', 'with the list of people')
    test.assertTextExists('bob','and my new user is listed')
  })
  casper.run(function(){
    test.done()
  })
})
