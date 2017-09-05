'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// table user
const replycommentSchema = mongoose.Schema({

    comment_id				: {type: mongoose.Schema.ObjectId, ref: 'comment'},
    user_id                 : {type: mongoose.Schema.ObjectId, ref: 'suriuser'},
    code_reply				: String,
    status      			: String,
    name  		            : String,
    create_at               : String

});

mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://192.168.1.14:27017/suri_db');
// const connect = require('./connect');
// connect.Connect_to();

// const user = mongoose.model('user', userSchema);
module.exports = mongoose.model('reply_comment', replycommentSchema);
