"use strict";

var client = require('../_base').Client;
var util = require('util');

function ScoreService() {
	var self = this instanceof ScoreService ? this : new ScoreService();

	self._defaults = {
		host: 'https://scoreservice.lenddo.com'
	};

	self.ClientRecommendation = {
		get: function getClientRecommendation(client_id, partner_script_id) {
			return self.get('ClientRecommendation/' + client_id).query({
				partner_script_id: partner_script_id
			});
		}
	};

	self.ClientVerification = {
		get: function getClientVerification(client_id, partner_script_id) {
			return self.get('ClientVerification/' + client_id).query({
				partner_script_id: partner_script_id
			});
		}
	};

	self.ClientScore = {
		get: function getclientScore(client_id, partner_script_id) {
			return self.get('ClientScore/' + client_id).query({
				partner_script_id: partner_script_id
			});
		}
	};

	// Apply arguments as config if available.
	if (arguments.length >= 2) {
		self.config.apply(self, arguments);
	}

	return self;
}

util.inherits(ScoreService, client);

module.exports.ScoreService = ScoreService;
