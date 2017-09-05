const userSuri = require('../models/table_user');
const smsCode = require('../models/table_sms_code');
const bcrypt = require('bcryptjs');

exports.registerSuri =(name, phonenumber, password, userType, lattitude, longitude, token) =>
	new Promise((resolve, reject) => {
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);
		// kiem tra phone da duoc su dung hay chua
		userSuri.find({phone_number: phonenumber})
		.then(users => {
			var d = new Date();
			var timeStamp = d.getTime();

			if(users.length == 0){
				// userSuri: name connect with table_user
				const newUser = new userSuri({

					name: name,
					phone_number: phonenumber,
					user_type: userType,
					lattitude: lattitude,
					longitude: longitude,
					token: token,
					hashed_password: hash,
					created_at: timeStamp

				});
				newUser.save()

				.then(() => {
					const iduser  = newUser._id;

					resolve({status: 201, request_check: 0,  userid: iduser, name: name, phone: phonenumber, message: 'user Registered Successfully'})
				})

				.catch(err =>{
					if(err.code == 11000){
						reject({status: 409, request_check: 1, message: 'User Already Registered !'});

					}else{
						reject({status: 500, request_check: 2, message: 'Internal Server Error !'});
					}
				});

				}else{
					reject({status: 404,request_check: 3, message: 'Phonenumber is used !'});
				}
			})
            .catch(err =>{
                reject({status: 500, request_check: 2, message: 'Internal Server Error !'});
            });

		
	});

	// sau khi đăng ký xong, gửi sms mã xác nhận để xác nhận phone
	exports.sendsms = (userId, to, smsContent, smsType, brandName, dlr) =>

    new Promise((resolve, reject) => {
    	
    		smsCode.find({user_id: userId})

    		.then(sms_codes => {
    			if(sms_codes.length ==0){

    				var d = new Date();
					var timeStamp = d.getTime();

					const newSms = new smsCode({

							user_id: userId,
							code: smsContent,
							state: "0",
							created_at: timeStamp
					});

					newSms.save()

						.then(() => {

						console.log("ffffffff:  sms send code:  "+userId+" to: "+to+" smsContent: "+ smsContent);

							const idsms  = newSms._id;

							var request = require('request');

					        var headers = {
					            'Content-Type': 'application/json'
					        };

					        var dataString = '{"to": ["'+to+'"], "content":   "Dùng '+smsContent+' để xác minh tài khoản suri của bạn!", "sms_type": 2, "sender": ""}';

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
					                console.log(" error sms: "+body);
					            }
					        }

					        request(options, callback);
							resolve({status: 201,  smsid: idsms,  message: 'code sended Successfully'});
						})

						.catch(err => {

								reject({ status: 500, message: 'Internal Server Error !' });

						});

			        // update code in sms_code
    			}else{
    				let sms = sms_codes[0];
    				sms.code = smsContent;
    			    sms.save();
    			    const idsms = sms._id;

    			    resolve({status: 201,  smsid: idsms,  message: 'code sended Successfully'});

    			}
    		})

    });

	// resent OTP : gửi lại verificode
exports.ReSendSms = (userId) =>

    new Promise((resolve, reject) => {

        userSuri.find({_id: userId})
            .then(users => {
            	console.log("aaaaaa "+users.length+ " userId: "+userId);
                if(users.length !=0) {

                    let user = users[0];

                    const phone = user.phone_number;
                    console.log(phone + " fgfdhfdfjj");

                    smsCode.find({user_id: userId})
                        .then(smss => {

                            const code = smss[0].code;
                            console.log(phone + " fgfdhfdfjj");
                            console.log("ffffffff:  sms send code:  " + userId + " to: " + phone + " smsContent: " + code);



                            var request = require('request');

                            var headers = {
                                'Content-Type': 'application/json'
                            };

                            var dataString = '{"to": ["' + phone + '"], "content":   "Dùng ' + code + ' để xác minh số điện thoại của bạn!", "sms_type": 2, "sender": ""}';

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
                            resolve({status: 200,  message: 'code sended Successfully'});
                        });
                }
                    // update code in sms_code
                // }else{
                //     let sms = sms_codes[0];
                //     sms.code = smsContent;
                //     sms.save();
                //     const idsms = sms._id;
                //     resolve({status: 201,  smsid: idsms,  message: 'code sended Successfully'});
                //
                // }
            })

    });

// request verificode :verificode yêu cầu kiểm tra verificode -> xác nhận phone  

exports.requestCode =(userId, code) =>
	new Promise((resolve, reject) => {
		console.log(" verrificode: usser: "+userId+" code: "+code)

		// tim kiem trong table_sms_code có trường nào user_id sau đó so sánh "code"
		smsCode.find({user_id: userId})
		.then(smss => {
			var d = new Date();
			var timeStamp = d.getTime();

			let sms = smss[0];

			if(sms.code.toString().trim() === code){
				sms.state = "1";
    			 sms.save()
                     .then(() =>{
                         userSuri.find({_id: userId})
                             .then(users =>{

                                 let user = users[0];
                                 user.state = "1";
                                 user.save();

                             });
                     })
                     .catch(err =>{

                             reject({status: 500, request_check: 2, message: 'Internal Server Error !'});

                     });

    			 resolve({status: 201,  request_check: 0,  message: 'Chúc mừng bạn đã đăng ký thành công!'})
			}else{
				resolve({status: 201,  request_check: 1,  message: 'Mã code không đúng'});
			}

			
		})

		
	});
