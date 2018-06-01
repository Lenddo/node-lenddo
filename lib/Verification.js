"use strict";

module.exports = function Verification() {
	if (!this instanceof Verification) {
		return new Verification();
	}

	const verification = {
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
		firstName: (value) => {
			verification.name.first = value;
			return this;
		},
		middleName: (value) => {
			verification.name.middle = value;
			return this;
		},
		lastName: (value) => {
			verification.name.last = value;
			return this;
		},
		dateOfBirth: (value) => {
			verification.date_of_birth = value;
			return this;
		},
		employer: (value) => {
			verification.employer = value;
			return this;
		},
		mobilePhone: (value) => {
			verification.phone.mobile = value;
			return this;
		},
		university: (value) => {
			verification.university = value;
			return this;
		},
		email: (value) => {
			verification.email = value;
			return this;
		}
	};

	this.export = () => {
		return verification;
	}
};