'use strict';
const mongoose = require("./connect");

const Schema = require("mongoose/lib/schema");

// table user
const detail_notificationSchema = mongoose.Schema({

    notification_id        : {type: mongoose.Schema.ObjectId, ref: 'notification'},
    user_id             : {type: mongoose.Schema.ObjectId, ref: 'suriuser'},
    watching	        : String,
    create_at           : String

});

mongoose.Promise = global.Promise;
module.exports = mongoose.model('detail_notification', detail_notificationSchema);
