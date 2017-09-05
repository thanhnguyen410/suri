'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// table user
const suriUserSchema = mongoose.Schema({

    face_id				: String,
    name				: String,
    phone_number		: String,
    hashed_password		: String,
    token				: String,
    image				: String,
    created_at			: String,
    temp_password		: String,
    temp_password_time	: String,
    user_type			: String,
    latitude			: String,
    longitude			: String,
    state				: String,
    fix_job             : String, // field điền ngành nghề chuyên môn
    description         : String // field để mô tả kỹ năng của người thợ

});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://192.168.1.14:27017/suri_db');
// const connect = require ('./connect');
// connect.Connect_to();

// const user = mongoose.model('user', userSchema);
module.exports = mongoose.model('suriuser', suriUserSchema);
