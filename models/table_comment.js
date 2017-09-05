'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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
        mongoose.connect('mongodb://192.168.1.14:27017/suri_db');
// const connect = require('./connect');

// connect.Connect_to();
// const user = mongoose.model('user', userSchema);
module.exports = mongoose.model('comment', commentSchema);
