var querystring = require('querystring'),
		http = require('http'),
		https = require('https');

module.exports = function request(method, path) {
	var query, body, headers = {}, date, self = this;

	// Ensure the method is properly cased.
	method = method.toUpperCase();

	// Ensure paths start with a leading slash.
	if (path[0] !== '/') path = '/' + path;

	/**
	 * Builds the request options
	 * @returns {{host: *, path: *, method: string}}
	 */
	function getRequestOptions() {
		// Build the base options object
		var options = {
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
		query: function (queryObject) {
			query = querystring.stringify(queryObject);
			return this;
		},
		/**
		 * Set the body to be sent with the request
		 * @param bodyObject
		 * @returns {*}
		 */
		body: function (bodyObject) {
			body = JSON.stringify(bodyObject);
			return this;
		},
		/**
		 * Execute the request
		 * @param callback
		 */
		exec: function (callback) {
			var requestOptions = getRequestOptions(), error, client;

			if(self.configuration.host.scheme === 'https') client = https;
			else client = http;

			var request = client.request(requestOptions, function (response) {
				var responseBody = '', status = response.statusCode, headers = response.headers;
				response.setEncoding('utf8');

				response.on('data', function (chunk) {
					responseBody += chunk;
				});

				response.on('end', function () {
					var data = undefined;
					try{
						data = JSON.parse(responseBody);
					} catch(e) {
						// Check if it's just not parseable
						if(e.message.indexOf('Unexpected token') === -1) {
							// We don't know what error occurred here...
							throw e;
						}
					}

					callback(error, {
						request: requestState(),
						response: {code: status, headers: headers, raw: responseBody, data: data}
					});
				});
			});

			if(requestOptions.body) {
				// if we have a body to send the server, send it.
				request.write(requestOptions.body);
			}

			request.on('error', callback);

			request.end();
		},
		requestState: requestState
	}
};
