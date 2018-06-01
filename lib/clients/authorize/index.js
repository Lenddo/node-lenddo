"use strict";

const rp = require('request-promise');
const client = require('../_base').Client;
const host = [ 'development', 'qa' ].indexOf(process.env.NODE_ENV) !== -1 && process.env.DEV_MODE_AUTHORIZE_API_URL?
	process.env.DEV_MODE_AUTHORIZE_API_URL : 'https://authorize-api.partner-service.link';
let self;

class AuthorizeService extends client {
	constructor(api_id, api_secret) {
		super(api_id, api_secret);
		self = this;
		this._defaults = { host }
		this.PriorityData = {
			post: this.submitPriorityData
		}
	}

	submitPriorityData (application_id, partner_script_id, priority_data) {
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

	getServiceToken() {
		return rp({
			method: 'GET',
			uri: this._defaults.host + '/service/token?method=token' ,
			json: true
		}).then((result) => {
			if (!result || ! result.token) {
				throw new Error('SERVICE_TOKEN_GENERATION_FAILED');
			}
			return result.token;
		});
	}

	submitConfiguredSession (partner_script_id, application_id, verification_data, partner_data) {
		if (!application_id || typeof application_id !== 'string' || application_id.length < 2) {
			throw new Error('APPLICATION_ID_INVALID');
		} else if (!partner_script_id || typeof partner_script_id !== 'string' || partner_script_id.length !== 24) {
			throw new Error('PARTNER_SCRIPT_ID_INVALID');
		} else if (!verification_data || typeof verification_data !== 'object') {
			throw new Error('VERIFICATION_DATA_INVALID');
		} else if (!partner_data || typeof priority_data !== 'object') {
			throw new Error('PARTNER_DATA_INVALID');
		}

		return rp({
			method: 'POST',
			uri: this._defaults.host + '/onboarding/configuredsession' ,
			form: { partner_script_id, application_id, verification_data, partner_data },
			json: true
		}).then((result) => {
			if (!result || ! result.short_url) {
				throw new Error('CONFIGURED_SESSION_GENERATION_FAILED');
			}
			return result.short_url;
		});

	}
}

module.exports.AuthorizeService = AuthorizeService;
