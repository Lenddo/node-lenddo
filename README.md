[![Build Status](https://travis-ci.org/Lenddo/node-lenddo.svg?branch=master)](https://travis-ci.org/Lenddo/node-lenddo) [![npm](https://img.shields.io/npm/v/lenddo.svg?style=plastic)](https://www.npmjs.com/package/lenddo) [![npm](https://img.shields.io/npm/l/lenddo.svg?style=plastic)](https://www.npmjs.com/package/lenddo)
# Lenddo Service Client
Please reference the /sample/implementation.js file for an example on how
you can implement the Lenddo REST services.

# Installing the package
Please perform the following command to install Lenddo into your
node.js codebase: `npm install lenddo`

# Sample Usage
All of the following examples assume you you have used the setup defined immediately below. This is used to structure your request to our API.
```javascript
// Configuration - Both of these can be found after logging into the Partners Dashboard.
// If you have difficulty obtaining these please contact your Lenddo account manager.
var id = '{YOUR_API_USER_ID}';
var secret = '{YOUR_API_SECRET}';

// Import clients
var lenddo_clients = require('lenddo').clients;
```
## Get User Score & Verification
```javascript
// this is the client ID that you sent us initially.
var client_id = '{YOUR_CLIENT_ID}'

// begin main script
var ScoreService = lenddo_clients.Score;
var client_instance = new ScoreService(id, secret);
```
### Score
```javascript
client_instance.ClientScore.get(client_id).exec(function(err, result) {
  var response = result.response;
  /**
  * response.data should look like the following:
  * { score: 521, flags: [] }
  **/
  console.log(response.data);
});
```
### Verification
```javascript
client_instance.ClientVerification.get(client_id).exec(function(err, result) {
  var response = result.response;
  /**
  * response.data should contain a large object detailing the verification results.
  **/
  console.log(response.data);
});
```

## Retrieving the MobileData
If you have an implementation with our android SDK and want access to the mobile data stream please use the following API call:
```javascript
// this is the partner script ID you used in the data SDK
var partner_script_id = '{YOUR_PARTNER_SCRIPT_ID}';

var NetworkService = lenddo_clients.Network;
var client_instance = new NetworkService(id, secret);

client_instance.MobileData.get(partner_script_id).exec(function(err, response) {
    /**
    * Here you will see a dump of the data received. Please consult with your Lenddo account manager
    * for documentation regarding the schema that you can expect to see here.
    */
    console.log(response.data);
});
```