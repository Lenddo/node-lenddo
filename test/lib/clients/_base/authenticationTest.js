var Authentication = require('../../../../lib/clients/_base/authentication').Authentication;

describe('client/_base', function(){
	describe('Authentication', function() {
		var auth = new Authentication('be22ce0b9875611d10606e1a', '$2a$10$Ik0yU.RmEsI8Pr1lLVgTn.SPdFIA2tcoy/frKl3rUcTVD5GvYimli');

		describe('#getStringToSign()', function() {
			it('should return a properly formatted string', function() {
				auth.getStringToSign('POST', 'foo', 'bar', 'baz').should.equal("POST\nfoo\nbar\nbaz");
			});

			it('should replace falsey values with an empty string', function() {
				auth.getStringToSign('get', null, 'foo', 'bar').should.equal("GET\n\nfoo\nbar");
				auth.getStringToSign('get', undefined, 'foo', 'bar').should.equal("GET\n\nfoo\nbar");
				auth.getStringToSign('get', false, 'foo', 'bar').should.equal("GET\n\nfoo\nbar");
			});

			it('should strip querystrings off of the url', function() {
				auth.getStringToSign('get', null, 'foo', 'bar?baz=qux').should.equal('GET\n\nfoo\nbar')
			});
		});

		describe('.getSignature()', function() {
			it('should return a properly formed signature for GET requests', function () {
				auth.getSignature('get', null, 'Mon Jan 01 HH:MM:SS GMT 2013', '/Members/0123456789abcdef01234567')
						.should.equal('LENDDO be22ce0b9875611d10606e1a:l6PxyV73V226B2XvaBsoWaE++Fo=');
			});

			it('should return a properly formed signature for POST requests', function () {
				auth.getSignature('post', '{"foo":"bar"}', 'Mon Jan 01 HH:MM:SS GMT 2013', '/Members')
						.should.equal('LENDDO be22ce0b9875611d10606e1a:kCnoAbWQ/9XNSWAzpxPwZI+ZWGI=');
			});
		})
	})
});