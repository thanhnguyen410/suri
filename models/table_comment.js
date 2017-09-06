'use strict';
const mongoose = require("./connect");

const Schema = require("mongoose/lib/schema");

// table user
const commentSchema = mongoose.Schema({

    user_id				: {type: mongoose.Schema.ObjectId, ref: 'suriuser'},
    suri_id             : {type: mongoose.Schema.ObjectId, ref: 'suri'},
    rep_comment      	: [{type: mongoose.Schema.ObjectId, ref: 'reply_comment'}],
    status				: String,
    code_comment		: String, 
    name                : String,
    create_at           : String

});

mongoose.Promise = global.Promise;
module.exports = mongoose.model('comment', commentSchema);

