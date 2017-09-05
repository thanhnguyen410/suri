

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const smsSchema = mongoose.Schema({ 

	user_id 		: { type: mongoose.Schema.ObjectId, ref: 'suriuser' },
	code			: String,
	state			: String,
	created_at		: String

});

mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://192.168.1.14:27017/suri_db');
// const connect = require('./connect');
// connect.Connect_to();

module.exports = mongoose.model('sms_code_reset_pass', smsSchema);