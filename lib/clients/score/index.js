"use strict";

var client = require('../_base').Client;
var util = require('util');

function ScoreService() {
	var self = this instanceof ScoreService ? this : new ScoreService();

	self._defaults = {
		host: 'https://scoreservice.lenddo.com'
	};

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

	// Apply arguments as config if available.
	if (arguments.length >= 2) {
		self.config.apply(self, arguments);
	}

	return self;
}

util.inherits(ScoreService, client);

module.exports.ScoreService = ScoreService;
