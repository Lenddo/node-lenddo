"use strict";

const lib = require('../../index');
const baseClient = require('../../lib/clients/_base').Client;

describe('/index', function () {
	it('should have a clients obect', function () {
		lib.should.have.property('clients');
		lib.clients.should.be.an.Object;
	});

	describe('#clients', function () {
		describe('#_base', function () {
			it('Should exist and be an object', function () {
				lib.clients.should.have.property('_base');
				lib.clients._base.should.be.an.Object;
			});
		});

		describe('#Authorize', function () {
			it('Should exist and be an object', function () {
				lib.clients.should.have.property('Authorize').Object;
				lib.clients.Authorize.should.be.an.Object;
			});

			it('Should be an instance of client', function () {
				const authorize_client = new lib.clients.Authorize();

				authorize_client.should.be.an.instanceOf(baseClient);
			});

			it('Should validate application_id', function (done) {
				const authorize_client = new lib.clients.Authorize();

				try {
					authorize_client.PriorityData.post('s');
					return done(new Error('code should not reach here!'));
				} catch (err) {
					err.message.should.be.equal('APPLICATION_ID_INVALID');
					return done();
				}
			});

			it('Should validate partner_script_id', function (done) {
				const authorize_client = new lib.clients.Authorize();

				try {
					authorize_client.PriorityData.post('adonis', '3423randomness');
					return done(new Error('code should not reach here!'));
				} catch (err) {
					err.message.should.be.equal('PARTNER_SCRIPT_ID_INVALID');
					return done();
				}
			});

			it('Should validate priority_data_id', function (done) {
				const authorize_client = new lib.clients.Authorize();

				try {
					authorize_client.PriorityData.post('adonis', '123456789abcdef123456789', 'should be an object');
					return done(new Error('code should not reach here!'));
				} catch (err) {
					err.message.should.be.equal('PRIORITY_DATA_INVALID');
					return done();
				}
			});

			//this test should be skipped and will be used in dev mode only
			it.skip('Should trigger the endpoint properly (please do not run with prod env)', function (done) {
				const authorize_client = new lib.clients.Authorize();

				authorize_client.config(
					'ad0215000000000000000001',
					'ihavesecrets--',
					'http://127.0.0.1:8010');

				try {
					return authorize_client.PriorityData.post('adonis', '000000000000000000000002', {}
					).exec(function (err, data) {
						if (err) {
							throw err;
						} else if (data.response.code >= 400) {
							return done(new Error(data.response.raw));
						}
						return done();
					});
				} catch (err) {
					err.message.should.be.equal('PRIORITY_DATA_INVALID');
					return done();
				}
			});
		});

		describe('#Score', function () {
			it('Should exist and be an object', function () {
				lib.clients.should.have.property('Score');
				lib.clients.Score.should.be.an.Object;
			});

			it('Should be an instance of client', function () {
				const score_client = new lib.clients.Score();

				score_client.should.be.an.instanceOf(baseClient);
			});
		});

		describe('#Network', function () {
			it('Should exist and be an object', function () {
				lib.clients.should.have.property('Network').Object;
				lib.clients.Network.should.be.an.Object;
			});

			it('Should be an instance of client', function () {
				const network_client = new lib.clients.Network();

				network_client.should.be.an.instanceOf(baseClient);
			});
		});
	});
});