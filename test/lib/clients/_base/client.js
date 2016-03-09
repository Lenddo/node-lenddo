var Client = require('../../../../lib/clients/_base/client');
var Authentication = require('../../../../lib/clients/_base/authentication').Authentication;

describe('client/_base', function(){
	describe('client', function() {
		var client = new Client();
		describe('request methods', function(){
			it('should provide REST methods', function(){
				client.config(1,2,"http://noop.lenddo.com");
				client.should.have.property('get').Function;
				client.should.have.property('post').Function;
				client.should.have.property('put').Function;
				client.should.have.property('delete').Function;
				client.should.have.property('options').Function;
			})
		});

		describe('#config', function(){
			it('should return itself', function(){
				client.config(1,2,"http://noop.lenddo.com").should.equal(client);
			});

			it('should set an authentication property.', function(){
				client.config(1,2,"http://noop.lenddo.com");
				client.authentication.should.be.instanceOf(Authentication);
			});

			it('should set the configuration property', function() {
				client.config(1,2,"https://noop.lenddo.com");
				client.should.have.ownProperty('configuration');
				client.configuration.should.eql({id:1, secret:2, host:{domain:"noop.lenddo.com", port:443, scheme: 'https'}});
			})
		});

		describe('#request', function(){
			var client = new Client();
			client.config(
					'be22ce0b9875611d10606e1a',
					'$2a$10$Ik0yU.RmEsI8Pr1lLVgTn.SPdFIA2tcoy/frKl3rUcTVD5GvYimli',
					'https://noop.lenddo.com'
			);

			it('should allow a request to be made with a stub method.', function() {
				['get', 'post', 'put', 'delete', 'options'].forEach(function(method) {
					var requestOptions = client[method]('foo').requestState().options;
					requestOptions.should.have.property('host').and.equal('noop.lenddo.com');
					requestOptions.should.have.property('port').and.equal(443);
					requestOptions.should.have.property('path').and.equal('/foo');
					requestOptions.should.have.property('method').and.equal(method.toUpperCase());
					requestOptions.should.have.property('headers').and.have.properties('Authorization', 'Date')
				})
			});

			it('should encode the body', function() {
				var request = client.post('foo').body({bar:'baz', pets: {cat:[0], dog:[4,2,{you:'know'}]}});

				request.requestState().body.should.equal('{"bar":"baz","pets":{"cat":[0],"dog":[4,2,{"you":"know"}]}}');
			});

			it('should encode the query', function() {
				var request = client.get('bar').query({filter:'dogs', delete:['cats', 'alligators'], eat: ['pizza', 'garlic bread']});

				request.requestState().query.should.equal("filter=dogs&delete=cats&delete=alligators&eat=pizza&eat=garlic%20bread");
			});

			describe('headers', function () {
				it('should properly set the Content-Length value.', function () {
					var request = client.post('bar').body({ "foo": "abc![]ñáéí" });

					request.requestState().options.headers[ 'Content-length' ].should.equal(24);
				});
			});
		});
	});
});