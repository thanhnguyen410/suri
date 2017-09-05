'use strict';

const userSuri = require('../models/table_user');
const smsCode = require('../models/table_reset_pass_sms_code');
const bcrypt = require('bcryptjs');

// xác nhận phone

exports.requestPhone = (phone, smsContent) =>

    new Promise((resolve, reject) => {

        userSuri.find({phone_number: phone})
            .then(users => {
            	console.log("aaaaaa "+users.length+ " phone: "+phone);
                if(users.length !=0) {

                    const user = users[0];

                    const user_id = user._id;
                    console.log(user_id + " fgfdhfdfjj");
                    smsCode.find({user_id: user_id})

	    		.then(sms_codes => {
                    console.log("ssssssss "+sms_codes.length+ " phone: "+phone);
                    if (sms_codes.length == 0) {

                        var d = new Date();
                        var timeStamp = d.getTime();

                        const newSms = new smsCode({

                            user_id: user_id,
                            code: smsContent,
                            state: "0",
                            created_at: timeStamp
                        });

                        newSms.save()

                            .then(() => {

                                console.log("ffffffff:  sms send code:  " + user_id + " to: " + to + " smsContent: " + smsContent);


                                var request = require('request');

                                var headers = {
                                    'Content-Type': 'application/json'
                                };

                                var dataString = '{"to": ["' + phone + '"], "content":   "Dùng ' + smsContent + ' để xác minh tài khoản suri của bạn!", "sms_type": 2, "sender": ""}';

                                var options = {
                                    url: 'http://api.speedsms.vn/index.php/sms/send',
                                    method: 'POST',
                                    headers: headers,
                                    body: dataString,
                                    auth: {
                                        'user': '_9d_Kf2LvM2rvM-oi6UIDjgBzjvKezMy',
                                        'pass': ''
                                    }
                                };

                                function callback(error, response, body) {
                                    if (!error && response.statusCode == 200) {
                                        console.log(" error sms: " + body);
                                    }
                                }

                                request(options, callback);
                                resolve({status: 201, responValue: 1, userId: user_id, message: 'code sended Successfully'});
                            })

                            .catch(err => {

                                    reject({status: 500, message: 'Internal Server Error !'});

                            });

                        // update code in sms_code
                    } else {

                        const sms = sms_codes[0];
                        sms.code = smsContent;
                        sms.save()
							.then(() => {
                                console.log("ffffffff:  sms send code:  " + user_id + " to: " + phone + " smsContent: " + smsContent);
                                var request = require('request');

                                var headers = {
                                    'Content-Type': 'application/json'
                                };

                                var dataString = '{"to": ["' + phone + '"], "content":   "Dùng ' + smsContent + ' để xác minh tài khoản suri của bạn!", "sms_type": 2, "sender": ""}';

                                var options = {
                                    url: 'http://api.speedsms.vn/index.php/sms/send',
                                    method: 'POST',
                                    headers: headers,
                                    body: dataString,
                                    auth: {
                                        'user': '_9d_Kf2LvM2rvM-oi6UIDjgBzjvKezMy',
                                        'pass': ''
                                    }
                                };

                                // noinspection JSAnnotator
                                function callback(error, response, body) {
                                    if (!error && response.statusCode == 200) {
                                        console.log(" error sms: " + body);
                                    }
                                }

                                request(options, callback);
                                resolve({status: 201, responValue: 1, userId: user_id, message: 'code sended Successfully'});

							});
                    }
                });
    			  
     // update code in sms_code
                }else{
                    
                    resolve({status: 201,  responValue: 0,  message: 'Không có tài khoản cho số điện thoại này!'});
                
                }
            })

    });

// request code
exports.requestCode =(userId, code) =>
    new Promise((resolve, reject) => {
        console.log(" verrificode: usser: "+userId+" code: "+code)

        // tim kiem trong table_sms_code có trường nào user_id sau đó so sánh "code"
        smsCode.find({user_id: userId})
            .then(smss => {

                const sms = smss[0];
                console.log(" sms code: "+ smss.length);

                if(sms.code.toString().trim() === code.toString().trim()){
                    sms.state = "1";
                    sms.save();

                    resolve({status: 201,  request_check: 1,  message: 'Xác nhận thành công!'})
                }else{
                    resolve({status: 201,  request_check: 2,  message: 'Mã code không đúng'});
                }

            })


    });
// reset password
    exports.resetPass =(userId, password) =>
        new Promise((resolve, reject) => {
            console.log(" verrificode: usser: "+userId+" code: "+password)
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            // tim kiem trong table_sms_code có trường nào user_id sau đó so sánh "code"
            userSuri.find({_id: userId})
                .then(users => {

                    const user = users[0];

                    user.hashed_password = hash;
                    user.save()
                        .then(()=>{
                            resolve({status: 201,  request_check: "1",  message: 'reset mật khẩu thành công!'})
                        })
                        .catch(err => {

                                reject({status: 500,  message: 'Internal Server Error !'});

                        });
                });

        });