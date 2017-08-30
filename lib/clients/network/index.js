"use strict";

// imports
var client = require('../_base').Client;
var util = require('util');
var Verification = require('../../Verification');

// module config
var valid_networks = [ 'Facebook', 'LinkedIn', 'Yahoo', 'WindowsLive', 'Google' ];

// begin module
function NetworkService() {
	var self = this instanceof NetworkService ? this : new NetworkService();

	self._defaults = {
		host: 'https://networkservice.lenddo.com'
	};

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
