"use strict";

// imports
const client = require('../_base').Client;
const util = require('util');
const Verification = require('../../Verification');

// module config
const valid_networks = [ 'Facebook', 'LinkedIn', 'Yahoo', 'WindowsLive', 'Google' ];

// begin module
function NetworkService() {
	const self = this instanceof NetworkService ? this : new NetworkService();
	const host = process.env.NODE_ENV === 'development' && process.env.DEV_MODE_NETWORK_SERVICE_URL?
		process.env.DEV_MODE_NETWORK_SERVICE_URL : 'https://networkservice.lenddo.com';

	self._defaults = { host };

	self.MobileData = {
		get: function(partner_script_id) {
			return self.get('MobileData?partner_script_id=' + partner_script_id);
		}
	};

	self.ClientToken = {
		post: function(application_id, partner_script_id, provider, oauth_key, oauth_secret, token_data) {
			if (valid_networks.indexOf(provider) === -1) {
				throw new Error(
					'Invalid provider (' + provider + ') provider must be one of the following: ' +
					valid_networks.join(','))
			}

			if (!token_data) {
				token_data = {};
			}

			// add key/secret to token data
			token_data.key = oauth_key;
			token_data.secret = oauth_secret;

			return self.post('PartnerToken').body({
				token_data: token_data,
				provider: provider,
				application_id: application_id,
				partner_script_id: partner_script_id
			})
		}
	};

	self.CommitClientJob = {
		post: function(application_id, partner_script_id, profile_ids, verification_data) {
			if (verification_data && !verification_data instanceof Verification) {
				throw new Error('"verification_data" must be an instance of the Verification object.');
			}

			if (
				// node.js - version safe Array.isArray()
				Object.prototype.toString.call(profile_ids) !== '[object Array]' ||
				profile_ids.length === 0
			) {
				throw new Error('"profile_ids" must be an array and must contain at least one entry');
			}

			return self.post('CommitPartnerJob').body({
				application_id: application_id,
				profile_ids: profile_ids,
				partner_script_id: partner_script_id,
				verification_data: verification_data ? verification_data.export() : undefined
			});
		}
	};

	// Apply arguments as config if available.
	if (arguments.length >= 2) {
		self.config.apply(self, arguments);
	}

	return self;
}

util.inherits(NetworkService, client);

module.exports.NetworkService = NetworkService;
