'use strict';

exports.Connect_to = () =>
    new Promise (() => {
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://192.168.1.14:27017/suri_db');
    });




