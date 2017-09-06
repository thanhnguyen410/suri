'use strict';
const mongoose = require("./connect");

const Schema = require("mongoose/lib/schema");
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
module.exports = mongoose.model('suri', suriSchema);