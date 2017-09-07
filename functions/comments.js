'use strict';

const comment = require('../models/table_comment');
const suri = require('../models/table_suri'); 
const rep_comment = require('../models/table_reply_comment');

exports.commentDetail = (comment_id) => 
	new Promise((resolve, reject) => {
		console.log(comment_id);

		let ObjectId = require("mongodb").ObjectId;

		comment.find({"_id" : ObjectId(comment_id)})

		.populate("rep_comment", "status name create_at code_reply")

		.then(comments => {
			if(comments.length === 0){
				reject({status: 404, message: "Bình luận không tồn tại !"});
			}else{
				return comments[0];
			}
		})

		.then(comments_one => {
			resolve(comments_one);
		})

		.catch(err => reject({status: 500, message: "Lỗi Server"}));
	}); 

exports.addComment = (user_id, suri_id, status, code_comment, name ) => 

	new Promise((resolve, reject) => {
		function displayNumbercomment(){
			let ObjectId = require("mongodb").ObjectId;
			comment.count({"suri_id" : ObjectId(suri_id)}, function(error, numOfDocs){
		  		global.number_cmt = numOfDocs;
			});
		}

		const d = new Date();
		const timeStamp = d.getTime();
		displayNumbercomment();
		console.log("Done !");
		const newComment = new comment({ 
			
			user_id     : user_id,
			suri_id     : suri_id,
			status      : status,
			code_comment: code_comment,
			name        : name,
			create_at   : timeStamp

		});

		newComment.save()

		.then(() => {

			suri.findByIdAndUpdate(
				suri_id,
				{$set: {"number_comment" : number_cmt + 1}},
				// {safe: true, upsert: true, new: true},
				function(err, model){}
			);

		})

		.then(() => resolve({status: 201, message: 'Comment created suscessfully !'}))

		.catch(err => reject({status: 500, message: 'Internal Server Error !'}));
	});

exports.updateComment = (comment_id, code_comment, status) => 
	new Promise ((resolve, reject) => {
		console.log(comment_id+ " " + code_comment + " " + status);

		let ObjectId = require("mongodb").ObjectId;

		comment.find({
			"_id" : ObjectId(comment_id)
		})

		.then(comments => {
			if(comments.length === 0){
				reject({status: 404, message: "Không tìm thấy bình luận"});
			}else{
				return comments[0];
			}
		})
		
		.then(comment_one => {
			const code = comment_one.code_comment;
			const id_cmt = comment_one._id;
			if(code_comment === code){
				comment.update({"_id": ObjectId(id_cmt)}, {$set: {"status": status}})

				.then(() => {
					resolve({status: 200, message: "Cập nhật thành công !"});
				})
			}else{
				reject({status: 401, message: "Sai mã code"});
			}
		})

		.catch(err => reject({status: 500, message: "Lỗi Server !"}));
	});


exports.deleteComment = (comment_id, code_comment, suri_id) => 

	new Promise ((resolve, reject) => {

		console.log(suri_id + " " + comment_id + " " + code_comment);

		let ObjectId = require("mongodb").ObjectId;
		function displayNumbercomment(){
			comment.count({"suri_id" : ObjectId(suri_id)}, function(error, numOfDocs){
		  		global.number_cmt_d = numOfDocs;
			});
		}

		// displayNumbercomment();

		console.log("OK");

		comment.find({
			"_id" : ObjectId(comment_id)
		})

		.then(co => {
			if(co.length === 0){
				reject({status: 404, message: "Không tìm thấy bình luận !"});
			}else{
				return co[0];	
			}
		})

		.then(c => {
			console.log(c.user_id);
			var code = c.code_comment;
			var id_cmt = c._id;
			displayNumbercomment();
			if(c.user_id == "001001010101010101010111"){

				if(code_comment === code){

					console.log("FUCK 0")

					suri.findByIdAndUpdate(
						suri_id,
						{$set: {"number_comment" : number_cmt_d - 1}},
						{safe: true, upsert: true, new: true},
						function(err, model){}
					);
					// .then(() => {resolve({status: 300, message: "delete comment in suri suscessfully !"})});

					// .then(() => {

						rep_comment.remove({"comment_id" : ObjectId(id_cmt)})

						.then(() => {

							c.remove()

							.then(() => {
								resolve({status: 200, message: "Đã xóa !" });
							})
						})
					// })

				}else{

					reject({status: 401, message: 'Sai mã code !'});

				}
			}else{

				if(code_comment === "0000"){
					console.log("FUCK");

					suri.findByIdAndUpdate(
						suri_id,
						{$set: {"number_comment" : number_cmt_d - 1}},
						{safe: true, upsert: true, new: true},
						function(err, model){}
					);

					rep_comment.remove({"comment_id" : ObjectId(id_cmt)})

					.then(() => {

						c.remove()

						.then(() => {
							resolve({status: 200, message: "Đã xóa !" });
						})
					})

				}else{

					reject({status: 401, message: 'Sai mã code !'});

				}
			}

		})

		.catch(err => reject({status: 500, message: "Lỗi Server !"}));

	});