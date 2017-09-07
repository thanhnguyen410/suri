const auth = require('basic-auth');
const jwt = require('jsonwebtoken');
const profile = require('./functions/profile');
const password = require('./functions/password');
const config = require('./config/config.json');
const registerSuri = require('./functions/register');
const loginSuri = require('./functions/login');
const insertSuri = require('./functions/insert_suri');
const outputSuri = require('./functions/output_suri');
// const formidable = require('formidable');
const path = require('path');
const uploadDir = path.join('./uploads/');
var fs = require('fs');
const comments = require('./functions/comments');
const rep_comment = require('./functions/reply_comment');
const insuri = require('./functions/show-suridetail'); 
 
module.exports = router => {
    router.get('/', (req, res) => res.end('Welcome to suri !'));
    /*-------------------------------------------------------------------
                                    User
    --------------------------------------------------------------------*/
    // login
    router.post('/loginsuri', (req, res) => {
        const credentials = auth(req);
        if (!credentials) {
            res.status(400).json({message: 'Invalid Request !'});
        } else {
            loginSuri.login_user(credentials.name, credentials.pass)

                .then(result => {
                    // const token = jwt.sign(result, config.secret, {expiresIn: 1440});
                    res.status(result.status).json({
                        phone: result.phone,
                        name: result.name,
                        userid: result.userid,
                        state: result.state
                    });
                })
                .catch(err => res.status(err.status).json({request: err.request_check, message: err.message}));
        }
    });


    // login with facebook
    router.post('/facebook_users', (req, res) => {

        const name = req.body.name;
        const face_id = req.body.face_id;
        const lattitude = req.body.lattitude;
        const longitude = req.body.longitude;
        const userType = req.body.user_type;
        const token = req.body.token;

        console.log("login facebook: name " + name + " face_id: " + face_id + " lat: " + lattitude + " long: " + longitude + " userType: " + userType + " token: " + token);

        if (!name || !face_id || !name.trim() || !face_id.trim()
            || !userType || !userType.trim()) {

            res.status(400).json({message: 'Invalid Request !'});

        } else {
            loginSuri.loginFaceBook(face_id, name, lattitude, longitude, userType, token)
                .then(result => {
                    res.setHeader('Location', '/facebook_users/' + face_id);
                    res.status(result.status).json({
                        userid: result.userid,
                        name: result.name,
                        userType: result.userType,
                        message: result.message
                    })
                })

                .catch(err => res.status(err.status).json({request: err.request_check, message: err.message}));
        }
    });


    /*-------------------------------------------------------------------
                                    Profile and Repair
    --------------------------------------------------------------------*/


    // Hiển thị chi tiết thông tin User
    router.post('/showprofile', (req, res) => {
        const user_id = req.body.user_id;

        console.log(user_id);

        if (!user_id) {
            res.status(400).json({message: "Invalid Request !"});
        } else {
            profile.getProfile(user_id)

                .then(result => {
                    res.json(result)
                })

                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    // Đăng ký trở thành thợ sửa chữa
    router.post('/become_prepaire', (req,res) => {
        const user_id = req.body.user_id;
        const state = req.body.state;
        const fix_job = req.body.fix_job;
        const description = req.body.description;

        if(!user_id || !state || !fix_job || !description){
            res.status(400).json({message: "Invalid Request !"});
        }else{
            profile.becomeRepaire(user_id, state, fix_job, description)

                .then(result => {
                    res.status(result.status).json({message : result.message});
                })

                .catch(err => {
                    res.status(err.status).json({message : err.message})
                })
        }

    });

    // Hiển thị danh sách thợ sửa

    router.post('/list_repairer', (req, res) => {

        const skip = parseInt(req.body.skip);

        if(skip < 0){
            res.status(400).json({message: "Invalid Request !"})
        }else{
            profile.listRepairer(skip)

            .then(result => res.json(result))

            .catch(err => res.status(err.status).json({message: err.message}));
        }   

    });


    /*-------------------------------------------------------------------
                                    Register
    --------------------------------------------------------------------*/
// register suri
    router.post('/usersuri', (req, res) => {

        const name = req.body.name;
        const phonenumber = req.body.phone;
        const password = req.body.password;
        const lattitude = req.body.lattitude;
        const longitude = req.body.longitude;
        const userType = req.body.user_type;
        const token = req.body.token;
        console.log("aaaaaa " + name + " phone: " + phonenumber + " pass: " + password + " lat: " + lattitude + " long: " + longitude + " userType: " + userType);

        // logcat.d("aaaaaaa"+ name);

        if (!name || !phonenumber || !password || !name.trim() || !phonenumber.trim() || !password.trim()
            || !userType || !userType.trim()) {

            res.status(400).json({request: 2, message: 'Invalid Request !'});

        } else {
            // request check: 1: user da duoc dang ky, 2: lỗi server, 3: phone number đã được sử dụng
            registerSuri.registerSuri(name, phonenumber, password, userType, lattitude, longitude, token)
                .then(result => {

                    var val = Math.floor(100000 + Math.random() * 999999);
                    console.log(val);

                    registerSuri.sendsms(result.userid, phonenumber, val, "", "", 1);

                    res.setHeader('Location', '/usersuri/' + phonenumber);
                    res.status(result.status).json({
                        request: result.request_check, userid: result.userid, name: result.name,
                        phone: result.phone, message: result.message
                    })
                })

                .catch(err => res.status(err.status).json({request: err.request_check, message: err.message}));
        }
    });


// verificode yêu cầu kiểm tra verificode -> xác nhận phone
    router.post('/request_code', (req, res) => {
        const user_id = req.body.user_id;
        const code = req.body.code;

        console.log(" " + user_id + " code: " + code);

        if (!user_id || !code || !user_id.trim() || !code.trim()) {

            res.status(400).json({message: 'Invalid Request !'});

        } else {

            registerSuri.requestCode(user_id, code)

                .then(result => {

                    res.setHeader('Location', '/request_code/' + user_id);
                    res.status(result.status).json({request: result.request_check, message: result.message})
                })

                .catch(err => res.status(err.status).json({request: err.request_check, message: err.message}));
        }
    });

// resend code
    router.post('/resend_code/:user_id', (req, res) => {
        const user_id = req.params.user_id;

        if (!user_id || !user_id.trim()) {

            res.status(400).json({message: 'Invalid Request !'});

        } else {

            registerSuri.ReSendSms(user_id)

                .then(result => res.json(result))

                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    // Forgot password: quên mật khẩu
    //XÁC NHẬN PHONE
    // send verificode
    router.post('/request_phone', (req, res) => {
        const phone = req.body.phone;

        console.log(" " + phone);

        if (!phone || !phone.trim()) {

            res.status(400).json({message: 'Invalid Request !'});

        } else {

            var val = Math.floor(100000 + Math.random() * 999999);
            console.log(val)
            password.requestPhone(phone, val)

                .then(result => {

                    res.setHeader('Location', '/request_phone/' + phone);
                    res.status(result.status).json({
                        response: result.responValue,
                        userid: result.userId,
                        message: result.message
                    })
                })

                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });
    // xác nhận verificode
    router.post('/request_code_forgot', (req, res) => {
        const user_id = req.body.user_id;
        const code = req.body.code;

        if (!user_id || !code || !user_id.trim() || !code.trim()) {

            res.status(400).json({message: 'Invalid Request !'});

        } else {

            password.requestCode(user_id, code)

                .then(result => {

                    res.setHeader('Location', '/request_code_forgot/' + user_id);
                    console.log(" request check: " + result.request_check)
                    res.status(result.status).json({request: result.request_check, message: result.message})
                })

                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });
    // reset pass
    router.post('/reset_password', (req, res) => {
        const user_id = req.body.user_id;
        const pass = req.body.password;

        if (!user_id || !pass || !user_id.trim() || !pass.trim()) {

            res.status(400).json({message: 'Invalid Request !'});

        } else {
            //

            password.resetPass(user_id, pass)

                .then(result => {

                    res.setHeader('Location', '/reset_password/' + user_id);
                    res.status(result.status).json({request: result.request_check, message: result.message})
                })

                .catch(err => res.status(err.status).json({errr: " hahaha", message: err.message}));
        }
    });


    /*-------------------------------------------------------------------
                                Suri (Post)
    --------------------------------------------------------------------*/

    // insert suri tab bài viết
    router.post('/insertsuri_fix', (req, res) => {

        const user_id = req.body.user_id;
        const status = req.body.status;
        const description = req.body.description;
        const images = req.body.images;
        const longitude = req.body.longitude;
        const latitude = req.body.latitude;


        if (!user_id || !status || !description || !user_id.trim() || !status.trim() || !description.trim()) {

            res.status(400).json({message: 'Invalid Request !'});

        } else {

            insertSuri.insertSuri_fix(user_id, status, description, images, latitude, longitude)

                .then(result => {

                    res.setHeader('Location', '/post_suri/' + user_id);
                    res.status(result.status).json({
                        suri_id: result.suri_id,
                        response: result.response,
                        message: result.message
                    })
                })

                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    // Update Suri tab Bài viết

    router.post('/updatesuri_fix', (req, res) => {
        const suri_id = req.body.suri_id;
        const status = req.body.status;
        const description = req.body.description;

        if (!suri_id || !status || !description) {
            res.status(400).json({message: "Invalid Request !"});
        } else {
            insertSuri.updateSuri_fix(suri_id, status, description)

                .then(result => {
                    res.status(result.status).json({message: result.message});
                })

                .catch(err => {
                    res.status(err.status).json({message: err.message});
                })
        }
    });


    // Insert Suri in Communiti
    router.post('/insertsuri_com', (req, res) => {

        let user_id = req.body.user_id;
        const status = req.body.status;
        const description = req.body.description;
        const name = req.body.name;
        const code = req.body.code;

        if(!user_id){
            user_id = "001001010101010101010111";
        };

        if(!code){
            code = "0000";
        };

        console.log(user_id);

        if (!user_id || !status || !description || !name || !code || !user_id.trim() || !status.trim() || !description.trim() || !name.trim() || !code.trim()) {

            res.status(400).json({message: 'Invalid Request !'});

        } else {

            // [orthers]
            // problems or suggestions

            insertSuri.insertSuri_community(user_id, status, description, name, code)

                .then(result => {

                    res.setHeader('Location', '/post_suri/' + user_id);
                    res.status(result.status).json({
                        suri_id: result.suri_id,
                        response: result.response,
                        message: result.message
                    })
                })

                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    // Update suri tab Cộng đồng
    router.post('/updatesuri_com', (req, res) => {
        const suri_id = req.body.suri_id;
        const status = req.body.status;
        const description = req.body.description;
        const name = req.body.name;
        const code = req.body.code;

        if (!suri_id || !status || !description || !name || !code || !status.trim() || !description.trim() || !name.trim()) {
            res.status(400).json({message: "Invalid Request !"});
        } else {
            insertSuri.updateSuri_community(suri_id, status, description, name, code)

                .then(result => {
                    res.status(result.status).json({message: result.message});
                })

                .catch(err => {
                    res.status(err.status).json({message: err.message});
                })
        }
    });


    router.post('/delete_suri', (req, res) => {
        const suri_id = req.body.suri_id;
        const code_delete = req.body.code_delete;

        if(!suri_id){
            res.status(400).json({message: "Invalid Request !"});
        }else{
            insertSuri.deleteSuri(suri_id, code_delete)

            .then(result => {
                res.status(result.status).json({message: result.message});
            })

            .catch(err => {
                res.status(err.status).json({message: err.message});
            })
        }

    });

    router.post('/upload_suri', (req, res) => {

        uploadImage(req, res);

    });

    // get image

    router.get('/uploads/:file', function (req, res){
            file = req.params.file;
            var img = fs.readFileSync(uploadDir + file);
            res.writeHead(200, {'Content-Type': 'image/jpg' });
            res.end(img, 'binary');

    });

    function uploadImage(req, res) { // This is just for my Controller same as app.post(url, function(req,res,next) {....
        const form = new formidable.IncomingForm();
        form.multiples = true;
        form.keepExtensions = true;
        form.uploadDir = uploadDir;
        form.parse(req, (err, fields, files) => {
            if (err) return res.status(500).json({error: err});
            console.log(files.image.path.substring(8));
            insertSuri.uploadsuri(fields.suri_id, files.image.path.substring(8));
            res.status(200).json({respone: 2, suri_id: fields.suri_id})
        });
        form.on('fileBegin', function (name, file) {
            const [fileName, fileExt] = file.name.split('.');
            file.path = path.join(uploadDir, `${fileName}_${new Date().getTime()}.${fileExt}`)

        })
    }

// out put

    router.post('/output_suri', (req, res) => {

        const user_id = req.body.user_id;

        if (!user_id || !user_id.trim()) {

            res.status(400).json({message: 'Invalid Request !'});

        } else {

            outputSuri.outputSuri(user_id)

                .then(result => res.json(result))

                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    // Chi tiết bài viết (Chi tiet suri)

    router.post('/suridetail', (req, res) => {
        const suri_id = req.body.suri_id;

        console.log(suri_id);

        if (!suri_id) {
            res.status(400).json({message: "Invalid Request !"});
        } else {
            insuri.showSuri(suri_id)

                .then(result => {
                    res.json(result)
                })

                .catch(err => res.status(err.status).json({message: err.message}));
        }
    });

    // Hiển thị bình luận trong bài viết

    router.post('/showcomment_insuri', (req, res) => {
        const suri_id = req.body.suri_id;
        const skip = parseInt(req.body.skip);

        console.log(suri_id + " " + skip);

        if (!suri_id) {
            res.status(400).json({message: "Invalid Request !"});
        } else {
            insuri.showComment_InSuri(suri_id, skip)

                .then(result => {
                    res.json(result)
                })

                .catch(err => res.status(err.status).json({message: err.message}));

        }

    })

    /*-------------------------------------------------------------------
                                    Show Home
    --------------------------------------------------------------------*/

    // Hiển thị bài viết tại trang chủ
    router.post('/home_community', (req, res) => {

        const skip = parseInt(req.body.skip);

        if(skip < 0){
            res.status(400).json({message: "Invalid Request !"})
        }else{
            insuri.showSuri_community(skip)

            .then(result => res.json(result))

            .catch(err => res.status(err.status).json({message: err.message}));
        }   

    });

    router.post('/home_fix', (req, res) => {

        const skip = parseInt(req.body.skip);

        if(skip < 0){
            res.status(400).json({message: "Invalid Request !"});
        }else{
            insuri.showSuri_fix(skip)

            .then(result => res.json(result))

            .catch(err => res.status(err.status).json({message: err.message}));
        }

    });


    /*-------------------------------------------------------------------
                                    Comment
    --------------------------------------------------------------------*/
    // Hiển thị chi tiết bình luận

    router.post('/commentdetail', (req, res) => {
        const comment_id = req.body.comment_id;

        if (!comment_id) {
            res.status(400).json({status: "Dữ liệu không tồn tại"});
        } else {
            comments.commentDetail(comment_id)

                .then(result => {
                    res.json(result)
                })

                .catch(err => res.status(err.status).json({message: err.message}));
        }

    });
 
    // Thêm bình luận

    router.post('/addcomment', (req, res) => {
        let user_id = req.body.user_id;
        const suri_id = req.body.suri_id;
        const status = req.body.status;
        let code_comment = req.body.code_comment;
        const name = req.body.name;

        if(!user_id){
            user_id = "001001010101010101010111";
        }
        if(!code_comment){
            code_comment = "0000";
        }

        console.log(user_id + code_comment);

        console.log(user_id + " " + suri_id + " " + status + " " + code_comment + " " + name);

        if (!user_id || !suri_id || !status || !code_comment || !name) {
            res.status(400).json({message: "Invalid Request !"});
        } else {
            comments.addComment(user_id, suri_id, status, code_comment, name)

                .then(result => {
                    res.status(result.status).json({message: result.message, comment: result.comment})
                })

                .catch(err => res.status(err.status).json({message: err.message}));
        }

    });


    // Cập nhật bình luận

    router.post('/updatecomment', (req, res) => {
        const comment_id = req.body.comment_id;
        const code_comment = req.body.code_comment;
        const status = req.body.status;

        console.log(comment_id + " " + code_comment + " " + status);

        if (!comment_id || !code_comment || !status) {
            res.status(400).json({message: "Dữ liệu không tồn tại"});
        } else {
            comments.updateComment(comment_id, code_comment, status)

                .then(result => {
                    res.status(result.status).json({message: result.message})
                })

                .catch(err => res.status(err.status).json({message: err.message}));
        }

    });

    // Xóa bình luận

    router.post('/deletecomment', (req, res) => {
        const comment_id = req.body.comment_id;
        const code_comment = req.body.code_comment;
        const suri_id = req.body.suri_id;

        console.log(comment_id + " " + code_comment);

        if (!comment_id || !code_comment) {
            res.status(400).json({message: "Invalid Request !"});
        } else {

            comments.deleteComment(comment_id, code_comment, suri_id)

                .then(result => {
                    res.status(result.status).json({message: result.message})
                })

                .catch(err => res.status(err.status).json({message: err.message}));

        }

    });


    /*-------------------------------------------------------------------
                                    Reply Comment
    --------------------------------------------------------------------*/

    // Thêm bình luận trả lời (Reply comment)

    router.post('/addrepcomment', (req, res) => {
        const comment_id = req.body.comment_id;
        let user_id = req.body.user_id;
        const suri_id = req.body.suri_id;
        const status = req.body.status;
        let code_reply = req.body.code_reply;
        const name = req.body.name;

        if(!user_id){
            user_id = "001001010101010101010111";
        }
        if(!code_reply){
            code_reply = "0000";
        }

        if (!comment_id || !user_id || !suri_id || !status || !code_reply || !name) {
            res.status(400).json({message: "Dữ liệu không tồn tại !"});
        } else {
            rep_comment.addRepComment(comment_id, user_id, suri_id, status, code_reply, name)

                .then(result => {
                    res.status(result.status).json({message: result.message, rep_cmt: result.rep_cmt})
                })

                .catch(err => res.status(err.status).json({message: err.message}));

        }

    });


    router.post('/updaterepcomment', (req, res) => {
        const rep_comment_id = req.body.rep_comment_id;
        const code_reply = req.body.code_reply;
        const description = req.body.description;

        console.log(rep_comment_id + " " + code_reply + " " + description);

        if (!rep_comment_id || !code_reply || !description) {
            res.status(400).json({message: "Dữ liệu không tồn tại !"});
        } else {
            rep_comment.updateRepComment(rep_comment_id, code_reply, description)

                .then(result => {
                    res.status(result.status).json({message: result.message});
                })

                .catch(err => {
                    res.status(err.status).json({message: err.message});
                })
        }

    });


    router.post('/deleterepcomment', (req, res) => {
        const rep_comment_id = req.body.rep_comment_id;
        let code_reply = req.body.code_reply;

        if(!code_reply){
            code_reply = "0000";
        }

        console.log(rep_comment_id + " " + code_reply);

        if (!rep_comment_id || !code_reply) {
            res.status(400).json({message: "Invalid Request !"});
        } else {

            rep_comment.deleteRepComment(rep_comment_id, code_reply)

                .then(result => {
                    res.status(result.status).json({message: result.message})
                })

                .catch(err => res.status(err.status).json({message: err.message}));

        }

    });
}

