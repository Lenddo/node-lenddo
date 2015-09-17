// Configurable Bits
var host = 'https://scoreservice.lenddo.com';
var id = '';
var secret = '';

// Request Bits
var client_id = ''

// Start main script
var lenddo_service_clients = require('../').clients;
var ScoreService = lenddo_service_clients.Score;

// Configure Score ScoreService
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
