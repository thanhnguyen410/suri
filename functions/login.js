const user = require('../models/table_user');
const bcrypt = require('bcryptjs');

exports.login_user = (phonenumber, password) =>

	new Promise((resolve, reject) => {
		//reject({status: 404, message: password});
		user.find({ phone_number: phonenumber})
		.then(users => {
			if(users.length ==0){
				reject({status: 404, request_check:0, message: 'User Not Found !'});
			}else{
				return users[0];
			}
		})
		.then(user => {
			const hashed_password = user.hashed_password;
			if(bcrypt.compareSync(password, hashed_password)){
				const name = user.name;
				const iduser = user._id;
				const  state = user.state;
				resolve({status: 200, phone: phonenumber, name:name, userid:iduser, state: state });

			}else{
				reject({status: 401, request_check: 2, message: 'Invalid Credentials !'});
			}
		})
		.catch(err => reject({ status: 500,request_check: 1, message: 'Internal Server Error !'}));
	});

	// login with facebook

	exports.loginFaceBook = (faceId, name,  lattitude, longitude,userType, token) => 

	new Promise((resolve,reject) => {
		user.find({face_id: faceId})
		.then(users => {
			 		console.log("aaaaaa "+name+" face_id: "+faceId+  " lat: "+lattitude+ " long: "+longitude+" userType: "+userType+ " token: "+token);

			if(users.length ==0){

			 	var d = new Date();
					var timeStamp = d.getTime();

					const newUser = new user({

							face_id: faceId,
							name: name,
							latitude: lattitude,
							longitude: longitude,
							user_type : userType,
							token	  : token,
							created_at: timeStamp
					});

						newUser.save()

						.then(() => {
							const iduser  = newUser._id;
							cosole.log("iduser: "+iduser);
							resolve({status: 201,  userid: iduser, name: name,  userType: userType, message: 'user Registered Successfully'});
						})

						.catch(err => {

								reject({ status: 500, message: 'Internal Server Error !' });

						});
				} 
				else{

					const name = users[0].name;
					const user_id = users[0]._id;
					const userType = users[0].user_type;
					resolve({status: 201,  userid: user_id, name: name,  userType: userType, message: 'Login Successfully'});
				}
				

				});
	});