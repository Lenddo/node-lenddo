"use strict";

module.exports = function Verification() {
	if (!this instanceof Verification) {
		return new Verification();
	}

	var verification = {
		name: {
			first: undefined,
			middle: undefined,
			last: undefined
		},
		date_of_birth: undefined,
		employer: undefined,
		phone: {
			mobile: undefined
		},
		university: undefined,
		email: undefined
	};

	this.set = {
		firstName: function(value) {
			verification.name.first = value;
			return this;
		},
		middleName: function(value) {
			verification.name.middle = value;
			return this;
		},
		lastName: function(value) {
			verification.name.last = value;
			return this;
		},
		dateOfBirth: function(value) {
			verification.date_of_birth = value;
			return this;
		},
		employer: function(value) {
			verification.employer = value;
			return this;
		},
		mobilePhone: function(value) {
			verification.phone.mobile = value;
			return this;
		},
		university: function(value) {
			verification.university = value;
			return this;
		},
		email: function(value) {
			verification.email = value;
			return this;
		}
	};

	this.export = function() {
		return verification;
	}
};