'use strict';
const mongoose = require('mongoose');
//khai bao tk mk cua server
// const options = {
//    user: "suriteam",
//    pass: "finger123",
//    auth: {
//       authdb: 'admin'
//    }
// };
mongoose.connect('mongodb://192.168.1.14:27017/suri_db');
module.exports = mongoose;