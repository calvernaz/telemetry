var soap = require('soap'),
  XmlDocument = require('xmldoc').XmlDocument;

var url = "http://load-interactive.com/ubishare/syncwsdl.php?wsdl"

var args = { key: 'userID', value:1,
            key:'radius', value:5 }


soap.createClient(url, function(err, client) {
  client.ListUsersNearby(args, function(err, result) {
    if (err) console.log("Error thrown: " + err)

    var results = new XmlDocument(result.return)
    var users = results.childNamed("users")
    users.eachChild(function (user)
    {
      console.log(user.childrenNamed("name")[0].val)
    })
  })
})