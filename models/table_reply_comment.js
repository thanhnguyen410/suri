'use strict';
const mongoose = require("./connect");

const Schema = require("mongoose/lib/schema");

// table user
const replycommentSchema = mongoose.Schema({

    comment_id				: {type: mongoose.Schema.ObjectId, ref: 'comment'},
    user_id                 : {type: mongoose.Schema.ObjectId, ref: 'suriuser'},
    suri_id					: {type: mongoose.Schema.ObjectId, ref: 'suri'},
    code_reply				: String,
    status      			: String,
    name  		            : String,
    create_at               : String

});


mongoose.Promise = global.Promise;
module.exports = mongoose.model('reply_comment', replycommentSchema);
