'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// table user
const detail_notificationSchema = mongoose.Schema({

    notification_id        : {type: mongoose.Schema.ObjectId, ref: 'notification'},
    user_id             : {type: mongoose.Schema.ObjectId, ref: 'suriuser'},
    watching	        : String,
    create_at           : String

});


mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://192.168.1.14:27017/suri_db');
// const connect = require('./connect');
// connect.Connect_to();

// const user = mongoose.model('user', userSchema);
module.exports = mongoose.model('detail_notification', detail_notificationSchema);
