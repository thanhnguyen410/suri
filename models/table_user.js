'use strict';
const mongoose = require("./connect");

const Schema = require("mongoose/lib/schema");

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
module.exports = mongoose.model('suriuser', suriUserSchema);
