"use strict";

const querystring = require('querystring');
const http = require('http');
const https = require('https');

module.exports = (method, path) => {
	let query, body, date;
	const headers = {};
	const self = this;

	// Ensure the method is properly cased.
	method = method.toUpperCase();

	// Ensure paths start with a leading slash.
	if (path[0] !== '/') {
		path = '/' + path;
	}

	/**
	 * Builds the request options
	 * @returns {{host: *, path: *, method: string}}
	 */
	function getRequestOptions() {
		// Build the base options object
		const options = {
			host: self.configuration.host.domain,
			port: self.configuration.host.port,
			path: path + (query ? '?' + query : ''),
			method: method,
			body: body,
			query: query
		};

		// Build the date, configure the headers
		date = new Date().toUTCString();
		headers['Authorization'] = self.authentication.getSignature(method, body, date, path);
		headers['Date'] = date;
		headers['Content-type'] = 'application/json';
		headers['Content-length'] = body ? Buffer.byteLength(body, 'utf8') : 0;

		options.headers = headers;
		return options;
	}

	function requestState() {
		return {
			options: getRequestOptions(),
			body: body,
			query: query
		}
	}

	return {
		/**
		 * Set the query string to be attached to the URL
		 * @param queryObject
		 * @returns {*}
		 */
		query: (queryObject) => {
			query = querystring.stringify(queryObject);
			return this;
		},
		/**
		 * Set the body to be sent with the request
		 * @param bodyObject
		 * @returns {*}
		 */
		body: (bodyObject) => {
			body = JSON.stringify(bodyObject);
			return this;
		},
		/**
		 * Execute the request
		 * @param callback
		 */
		exec: async () => {
			return new Promise ((resolve, reject) => {
				try {
					const requestOptions = getRequestOptions();
					let client;

					if (self.configuration.host.scheme === 'https') {
						client = https;
					} else {
						client = http;
					}

					const request = client.request(requestOptions, (response) => {
						let responseBody = '';
						const status = response.statusCode;
						const headers = response.headers;

						response.setEncoding('utf8');
						response.on('data', (chunk) => {
							responseBody += chunk;
						});

						response.on('end', () => {
							let data = undefined;

							try {
								data = JSON.parse(responseBody);
							} catch (e) {
								// Check if it's just not parseable
								if (e.message.indexOf('Unexpected token') === -1) {
									// We don't know what error occurred here...
									return reject(e);
								}
							}

							return resolve({
								request: requestState(),
								response: { code: status, headers, raw: responseBody, data }
							});
						});
					});

					if (requestOptions.body) {
						// if we have a body to send the server, send it.
						request.write(requestOptions.body);
					}

					request.on('error', reject);
					request.end();
				} catch (err) {
					return reject(err);
				}
			});
		},
		requestState: requestState
	}
};
