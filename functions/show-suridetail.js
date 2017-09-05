'use strict';

const suri = require('../models/table_suri');
const user = require('../models/table_user');
const comment = require('../models/table_comment');

exports.showSuri_community = (skip) =>
    new Promise((resolve, reject) => {

        suri.find({},{"__v" : 0})

            .limit(10)

            .skip(10 * skip)

            .populate({path: "user_id", select: "name"})

            .then(suri => resolve(suri))

            .catch(err => reject({status: 500, message: "Internal Server Error !"}));

    });

exports.showSuri_fix = (skip) =>
    new Promise((resolve, reject) => {

        suri.find({"type" : "1"},{"description" : 0, "__v" : 0})

            .limit(2)

            .skip(2 * skip)

            .populate({path: "user_id", select: "name"})

            .then(suri => resolve(suri))

            .catch(err => reject({status: 500, message: "Internal Server Error !"}));

    });


exports.showSuri = (suri_id) =>
    new Promise((resolve, reject) => {

        let ObjectId;

        ObjectId = require("mongodb").ObjectId;
        console.log(suri_id);

        // suri.find({'_id' : ObjectId(suri_id)}, {"_id" : 0, "temp_password" : 0, "temp_password_time" : 0})
        suri.find({'_id' : ObjectId(suri_id)}, {"_id" : 0})

            .populate({
                path: "user_id", select: "_id name"
            })

            .then(suris => {
                if(suris.length === 0){
                    reject({status : 404, message: "Suri not found !"});
                }else{
                    return suris[0];
                }
            })

            .then(suri => resolve(suri))

            .catch(err => reject({status: 500, message: "Internal Server Error !"}));

    });

exports.showComment_InSuri = (suri_id, skip) =>
    new Promise ((resolve, reject) => {
        let ObjectId;
        ObjectId = require("mongodb").ObjectId;

        console.log("Done !");

        comment.find({"suri_id" : ObjectId(suri_id)},{"user_id" : 0, "suri_id" : 0, "code_comment" : 0})
            .populate({
                path: "rep_comment", select: "_id name status create_at"
            })
            .limit(1)
            .skip((1*skip))

            .then(get_comments => {
                if(get_comments.length === 0){
                    reject({status: 404, message: "Không tìm thấy dữ liệu"});
                }else{
                    return get_comments;
                }
            })

            .then(get_comment => resolve(get_comment))

            .catch(err => reject({status: 500, message: "Lỗi Server !"}))

    });

