"use strict";

const hash = require('./hash');

function Authentication(id, secret) {
	const self = this instanceof Authentication ? this : new Authentication(id, secret);

	/**
	 * Returns the signature for this request.
	 * @param method
	 * @param body
	 * @param date
	 * @param url
	 */
	self.getSignature = (method, body, date, url) => {
		// Build the MD5
		const contentMd5 = !!body ? hash.md5(body) : "";
		// Build the string to be signed
		const stringToSign = self.getStringToSign(method, contentMd5, date, url);

		// Return the signature for the request.
		return 'LENDDO ' + id + ':' + self.signString(stringToSign, secret);
	};

	return self;
}

/**
 * The string to sign won't expect a query string to be present. As such we strip it from the request here.
 * @param path
 * @returns {*}
 */
Authentication.prototype.stripQueryString = (path) => {
	const queryIndex = path.indexOf('?');

	if (queryIndex > 0) {
		path = path.slice(0, queryIndex);
	}
	return path;
};

/**
 * Builds the string which will be signed
 * @param method
 * @param contentMd5
 * @param date
 * @param path
 * @returns string - {METHOD}\n{contentMd5}\n{date}\n{path}
 */
Authentication.prototype.getStringToSign = (method, contentMd5, date, path) => {
	return method.toUpperCase() + "\n" +
		// Add ContentMd5 || "" to prevent stringifying "undefined" or "null" values.
		(contentMd5 || "") + "\n" +
		date + "\n" + this.stripQueryString(path);
};

/**
 * Signs the string using the constructed string to sign and the secret to sign it against.
 * @param stringToSign
 * @param secret
 * @returns {string}
 */
Authentication.prototype.signString = (stringToSign, secret) => {
	return hash.sha1_hmac(stringToSign, secret, 'base64');
};

module.exports.Authentication = Authentication;