'use strict';
const mongoose = require("./connect");

const Schema = require("mongoose/lib/schema");

const smsSchema = mongoose.Schema({ 

	user_id 		: { type: mongoose.Schema.ObjectId, ref: 'suriuser' },
	code			: String,
	state			: String,
	created_at		: String,
});

mongoose.Promise = global.Promise;
module.exports = mongoose.model('sms_code', smsSchema);