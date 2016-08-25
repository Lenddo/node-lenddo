"use strict";

var lib = require('../../index');
var baseClient = require('../../lib/clients/_base').Client;

describe('/index', function() {
	it('should have a clients obect', function() {
		lib.should.have.property('clients');
		lib.clients.should.be.an.Object;
	});

	describe('#clients', function() {
		describe('#_base', function() {
			it('Should exist and be an object', function() {
				lib.clients.should.have.property('_base');
				lib.clients._base.should.be.an.Object;
			});
		});

		describe('#Score', function() {
			it('Should exist and be an object', function() {
				lib.clients.should.have.property('Score');
				lib.clients.Score.should.be.an.Object;
			});

			it('Should be an instance of client', function() {
				var score_client = new lib.clients.Score();
				score_client.should.be.an.instanceOf(baseClient);
			});
		});

		describe('#Network', function() {
			it('Should exist and be an object', function() {
				lib.clients.should.have.property('Network').Object;
				lib.clients.Network.should.be.an.Object;
			});

			it('Should be an instance of client', function() {
				var network_client = new lib.clients.Network();
				network_client.should.be.an.instanceOf(baseClient);
			});
		});
	});
});