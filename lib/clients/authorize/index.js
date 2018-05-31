"use strict";

const client = require('../_base').Client;
const util = require('util');

function AuthorizeService() {
	const self = this instanceof AuthorizeService ? this : new AuthorizeService();
	const host = [ 'development', 'qa' ].indexOf(process.env.NODE_ENV) !== -1
		&& process.env.DEV_MODE_AUTHORIZE_API_URL?
		process.env.DEV_MODE_AUTHORIZE_API_URL : 'https://authorize-api.partner-service.link';

	self._defaults = { host };

	self.PriorityData = {
		post: (application_id, partner_script_id, priority_data) => {
			if (!application_id || typeof application_id !== 'string' || application_id.length < 2) {
				throw new Error('APPLICATION_ID_INVALID');
			} else if (!partner_script_id || typeof partner_script_id !== 'string' || partner_script_id.length !== 24) {
				throw new Error('PARTNER_SCRIPT_ID_INVALID');
			} else if (!priority_data || typeof priority_data !== 'object') {
				throw new Error('PRIORITY_DATA_INVALID');
			}

			return self.post('/onboarding/prioritydata').body({
				partner_script_id: partner_script_id,
				application_id: application_id,
				data: priority_data
			})
		}
	};

	// Apply arguments as config if available.
	if (arguments.length >= 2) {
		self.config.apply(self, arguments);
	}

	return self;
}

util.inherits(AuthorizeService, client);

module.exports.AuthorizeService = AuthorizeService;
