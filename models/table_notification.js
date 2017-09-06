'use strict';
const mongoose = require("./connect");

const Schema = require("mongoose/lib/schema");

// table user
const notificationSchema = mongoose.Schema({

    suri_id             : {type: mongoose.Schema.ObjectId, ref: 'suri'},
    type_notification	: String,
    number_user         : String,
    create_at           : String

});

mongoose.Promise = global.Promise;
module.exports = mongoose.model('notification', notificationSchema);
