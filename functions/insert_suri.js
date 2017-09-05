const suri = require('../models/table_suri');
const bcrypt = require('bcryptjs');


// add a Suri in fix Tab

exports.insertSuri_fix = (userId, status, description, images, latitude, longitude) =>

    new Promise((resolve, reject)=> {

        const d = new Date();
        
        const timeStamp = d.getTime();

        console.log(userId + "  " + status);

        const newSuri = new suri({
            user_id					: userId,
            status					: status,
            description				: description,
            created_at              : timeStamp,
            type                    : "1",
            number_comment          : 0,
            images                  : images
        });

        newSuri.save()

            .then(() => resolve({status: 201, message: 'Suri Created Successfully !'}))

            .catch(err =>{
                if(err.code == 11000){
                    reject({status: 409, message: 'Suri Already Registered !'});
                } else{
                    reject({status: 500, message: 'Internal Server Error !'});
                }
            });
    });

// Update a Suri in Fix tab

exports.updateSuri_fix = (suri_id, status, description) =>

    new Promise((resolve, reject) => {
        console.log(suri_id+" "+ status +" "+ description);
        let ObjectId = require("mongodb").ObjectId;

        suri.find({"_id" : ObjectId(suri_id)})

            .then(posts => {
                if(posts.length === 0){
                    reject({status: 404, message: "Suri not found !"});
                }else{
                    return posts[0];
                }
            })

            .then(() => {
                suri.update({"_id" : ObjectId(suri_id)},{$set : {"status" : status, "description" : description}})
                    .then(() => {
                        resolve({status: 200, message: "Update Suri Successfully !"})
                    })
            })

            .catch(err => {
                reject({status: 500, message: "Internal Server Error !"})
            })

    });

// post communiti- -> insert suri
exports.insertSuri_community = (userId, status, description, name, code) =>

    new Promise((resolve, reject)=> {
        const d = new Date();
        const timeStamp = d.getTime();
        const newSuri = new suri({

            user_id					: userId,
            status					: status,
            description             : description,
            name					: name,
            code					: code,
            type                    : "0",
            number_comment          : 0,
            created_at              : timeStamp
        });

        newSuri.save()

            .then(() =>{
                const suri_id = newSuri._id;
                resolve({status: 201, suri_id: suri_id , response: 1, message: 'Suri Created Successfully !'});
            })

            .catch(err =>{
                if(err.code == 11000){
                    reject({status: 409, message: 'Suri Already Registered !'});
                } else{
                    reject({status: 500, message: 'Internal Server Error !'});
                }
            });
    });

// Update a Suri in Community tab

exports.updateSuri_community = (suri_id, status, description, name, code) =>

    new Promise((resolve, reject) => {
        console.log(suri_id+" "+ status +" "+ description +" "+ name);
        let ObjectId = require("mongodb").ObjectId;

        suri.find({"_id" : ObjectId(suri_id)})

            .then(posts => {
                if(posts.length === 0){
                    reject({status: 404, message: "Suri not found !"});
                }else{
                    return posts[0];
                }
            })

            .then(post => {
                const code_verify = post.code;
                if(code_verify === code){
                    suri.update({"_id" : ObjectId(suri_id)},{$set : {"status" : status, "description" : description, "name" : name}})

                        .then(() => {
                            resolve({status: 200, message: "Update Suri Successfully !"})
                        })
                }else{
                    reject({status: 401, message: "Wrong Code !"})
                }

            })

            .catch(err => {
                reject({status: 500, message: "Internal Server Error !"})
            })

    });

// insert suri
exports.uploadsuri = (suri_id, image) =>

    new Promise((resolve, reject) => {

        console.log(suri_id);

        let ObjectId;
        ObjectId = require("mongodb").ObjectID;

        suri.find({_id: ObjectId(suri_id)})
            .populate("suri")
            .then(suris => {

                if (suris.length === 0) {

                    reject({status: 404, message: "User Not Found !"});

                } else {

                    return suris[0];

                }
            })

            .then(suriPush => {
                suriPush.images.push(image);
                suriPush.save();


                resolve({status: 200,  message: "uploaded" });

            })
            .catch(err => reject({status: 500, message: "Internal Server Error !"}));

    });