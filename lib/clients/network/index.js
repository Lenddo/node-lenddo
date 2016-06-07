var client = require('../_base').Client,
		util = require('util');

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

	// Apply arguments as config if available.
	if(arguments.length >= 2) {
		self.config.apply(self, arguments);
	}

	return self;
}

util.inherits(NetworkService, client);

module.exports.NetworkService = NetworkService;
