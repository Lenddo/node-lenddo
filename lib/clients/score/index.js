var client = require('../_base').Client,
		util = require('util');

function ScoreService(){
	var self = this instanceof ScoreService ? this : new ScoreService();

	self.ClientRecommendation = {
		get: function(client_id) {
			return self.get('ClientRecommendation/' + client_id);
		}
	};

	self.ClientVerification = {
		get: function(client_id) {
			return self.get('ClientVerification/' + client_id);
		}
	};

	self.ClientScore = {
		get: function(client_id) {
			return self.get('ClientScore/' + client_id);
		}
	};

	return self;
}

util.inherits(ScoreService, client);

module.exports.ScoreService = ScoreService;
