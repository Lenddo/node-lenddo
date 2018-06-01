"use strict";

const client = require('../_base').Client;
const util = require('util');

function ScoreService() {
	const self = this instanceof ScoreService ? this : new ScoreService();
	const host = [ 'development', 'qa' ].indexOf(process.env.NODE_ENV) !== -1
		&& process.env.DEV_MODE_SCORE_SERVICE_URL?
		process.env.DEV_MODE_SCORE_SERVICE_URL : 'https://scoreservice.lenddo.com';

	self._defaults = { host };

	self.ClientRecommendation = {
		get: (application_id, partner_script_id) => {
			return self.get('ClientRecommendation/' + application_id).query({
				partner_script_id: partner_script_id
			});
		}
	};

	self.ClientVerification = {
		get: (application_id, partner_script_id) => {
			return self.get('ClientVerification/' + application_id).query({
				partner_script_id: partner_script_id
			});
		}
	};

	self.ClientScore = {
		get: (application_id, partner_script_id) => {
			return self.get('ClientScore/' + application_id).query({
				partner_script_id: partner_script_id
			});
		}
	};

	self.ApplicationScoreCard = {
		get: (application_id, partner_script_id) => {
			return self.get('ApplicationScorecards/' + application_id).query({
				partner_script_id: partner_script_id
			});
		}
	};

	self.ApplicationFeatures = {
		get: (application_id, partner_script_id) => {
			return self.get('ApplicationFeatures/' + application_id).query({
				partner_script_id: partner_script_id
			});
		}
	};

	self.ApplicationMultipleScores = {
		get: (application_id, partner_script_id) => {
			return self.get('ApplicationMultipleScores/' + application_id).query({
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
