'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// table suri
const suriSchema = mongoose.Schema({

    user_id					: [{type: mongoose.Schema.ObjectId, ref: 'suriuser'}],
    status					: String,
    images					: [String],
    description				: String,
	link                    : String,
    created_at				: String,
    code		        	: String,
    name                    : String,
    latitude				: String,
    longitude				: String,
    temp_password_time		: String,
	type                    : String,
    // comment					: [{type: mongoose.Schema.ObjectId, ref: 'comment'}]
    number_comment          : Number

});

mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://192.168.1.14:27017/suri_db');
// const connect = require('./connect');

// connect.Connect_to();

module.exports = mongoose.model('suri', suriSchema);