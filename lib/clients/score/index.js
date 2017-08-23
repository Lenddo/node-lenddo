"use strict";

var client = require('../_base').Client;
var util = require('util');

function ScoreService() {
	var self = this instanceof ScoreService ? this : new ScoreService();

	self._defaults = {
		host: 'https://scoreservice.lenddo.com'
	};

	self.ClientRecommendation = {
		get: function (application_id, partner_script_id) {
			return self.get('ClientRecommendation/' + application_id).query({
				partner_script_id: partner_script_id
			});
		}
	};

	self.ClientVerification = {
		get: function (application_id, partner_script_id) {
			return self.get('ClientVerification/' + application_id).query({
				partner_script_id: partner_script_id
			});
		}
	};

	self.ClientScore = {
		get: function (application_id, partner_script_id) {
			return self.get('ClientScore/' + application_id).query({
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
