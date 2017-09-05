/**
 * Created by DELL on 8/14/2017.
 */
const staSuri = require('../models/table_suri');
const bcrypt = require('bcryptjs');



exports.postDataSuri =(status, image, description) =>

    new Promise((resolve, reject) => {
        const salt = bcrypt.genSaltSync(10);
        //const hash = bcrypt.hashSync(password, salt);
        // kiem tra phone da duoc su dung hay chua
        const newUser = new staSuri({
            status : status,
            image : image,
            description: description,
            created_at: new Date()
        });
        newUser.save()

            .then((newUser) => {
                const iduser  = newUser._id;

                resolve({status: 201,  status: status, description: description, message: 'Save Successfully'})
            })

            .catch(err =>{
                if(err.code == 11000){
                    reject({status: 409, message: 'User Already Registered !'});

                }else{
                    reject({status: 500, message: 'Internal Server Error !'});
                }
            });


    });