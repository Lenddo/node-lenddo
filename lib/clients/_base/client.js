var Authentication = require('./authentication').Authentication,
		request = require('./request');

function Client(){}

/**
 * Configures the client to your credentials, optionally providing a host.
 *
 * @param id
 * @param secret
 * @param [host]
 * @returns {Client}
 */
Client.prototype.config = function(id, secret, host) {
	var port = 80, hostParts;

	if (!host) {
		host = (this._defaults || {}).host;
	}

	if(typeof host !== 'string') throw new Error('Host must be a string!');

	hostParts = host.match(/(http(?:s)?)?(?:\:\/\/)?([a-zA-Z0-9\-\.]+)(?:\:(\d+))?/);

	// If the port is set..
	if(hostParts[3]) port = parseInt(hostParts[3]);
	else if(hostParts[1] && hostParts[1] === 'https') port = 443;

	this.configuration = {
		id: id,
		secret: secret,
		host: {
			domain: hostParts[2],
			port: port,
			scheme: hostParts[1] || 'http'
		}
	};

	this.authentication = new Authentication(id, secret);

	//region Stub out some REST request methods
	this.get = this.request.bind(this, 'GET');
	this.post = this.request.bind(this, 'POST');
	this.put = this.request.bind(this, 'PUT');
	this.delete = this.request.bind(this, 'DELETE');
	this.options = this.request.bind(this, 'OPTIONS');
	//endregion

	return this;
};

Client.prototype.request = request;

module.exports = Client;