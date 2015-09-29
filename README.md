# Lenddo Service Client
Please reference the /sample/implementation.js file for an example on how
you can implement the Lenddo REST services.

# Installing the package
Please perform the following command to install Lenddo into your
node.js codebase: `npm install lenddo`

# Sample Usage
## Get User Score & Verification
```javascript
// Configurable Bits
var host = 'https://scoreservice.lenddo.com';
var id = '';
var secret = '';

// Request Bits
var client_id = ''

// Start main script
var lenddo_service_clients = require('../').clients;
var ScoreService = lenddo_service_clients.Score;

// Configure ScoreService
var client_instance = (new ScoreService()).config(id, secret, host);

// Retrieve Score
client_instance.ClientScore.get(client_id).exec(function(err, result) {
  var response = result.response;
  /**
  * response.data should look like the following:
  * { score: 521, flags: [] }
  **/
  console.log(response.data);
});

// Retrieve Verification
client_instance.ClientVerification.get(client_id).exec(function(err, result) {
  var response = result.response;
  /**
  * response.data should contain a large object detailing the verification results.
  **/
  console.log(response.data);
});
```
