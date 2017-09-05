'use strict';

const user = require('../models/table_user');

exports.getProfile = (user_id) =>

    new Promise((resolve,reject) => {
        let ObjectId;
        ObjectId = require("mongodb").ObjectId;

        console.log("VKL");

        user.find({ "_id": ObjectId(user_id) }, {"hashed_password" : 0, "token" : 0})

            .then(users => {
                if(users.length === 0){
                    reject({status: 404, message: "User not found !"})
                }else{
                    return users[0];
                }
            })

            .then(user => resolve(user))

            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

    });


//Thành viên trở thành thợ sửa
exports.becomeRepaire = (user_id, state, fix_job, description) =>
    new Promise((resolve, reject) => {
        let ObjectId = require("mongodb").ObjectId;

        user.find({"_id" : ObjectId(user_id)})

            .then(us => {
                if(us.length === 0){
                    reject({status: 404, message: "User not found !"});
                }else{
                    return us[0];
                }
            })

            .then(u => {
                const usertype = u.user_type;
                if(usertype === "0"){ // Kiểm tra xem có phải là thợ sửa hay chưa
                    user.update({"_id" : ObjectId(user_id)},{$set : {"state" : state, "fix_job" : fix_job, "description" : description, "user_type" : "1"}})

                        .then(() => {
                            resolve({status: 200, message: "Congratulation !"}) // Trở thành thợ sửa thành công
                        })
                }else{
                    reject({status: 500, message : "SORRY !!! You were became prepaire !"}) // Trường hợp đã trở thành thợ sửa
                }
            })

            .catch(err => {
                reject({status: 500, message : "Internal Server Error !"})
            })

    });