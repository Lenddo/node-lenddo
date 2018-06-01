"use strict";

const crypto = require('crypto');

module.exports = {
	/**
	 * Returns a md5 hash.
	 * @param string
	 * @returns string - hash
	 */
	md5: (string) => {
		return crypto.createHash('md5').update(string, 'utf8').digest('hex');
	},
	sha1_hmac: (string, secret, digest) => {
		return crypto.createHmac('sha1', secret).update(string).digest(digest || 'base64');
	}
};