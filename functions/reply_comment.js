'use strict';

const rep_comment = new require('../models/table_reply_comment');

const comment = new require('../models/table_comment');

exports.addRepComment = (comment_id, user_id, suri_id, status, code_reply, name) => 

	new Promise((resolve, reject) => {
		const d = new Date();

		const timeStamp = d.getTime();

		console.log(comment_id+" "+user_id+"  "+suri_id+" "+status+" "+code_reply+" "+name);

		const newRepComment = new rep_comment({
			comment_id : comment_id,
			user_id    : user_id,
			suri_id	   : suri_id,
			status     : status,
			code_reply : code_reply,
			name       : name,
			create_at  : timeStamp
		});

		newRepComment.save()

		.then(() => {
			comment.findByIdAndUpdate(
				comment_id,
				{$push: {"rep_comment" : newRepComment._id}},
				{safe: true, upsert: true, new: true},
				function(err, model){
					console.log(err);
				}
			);
		})

		.then(() => resolve({status: 201, message: "Bình luận thành công!"}))

		.catch(err => reject({status: 500, message: "Lỗi Server !"}));

	});

exports.updateRepComment = (rep_comment_id, code_reply, description) =>
	new Promise ((resolve, reject) => {
		console.log(rep_comment_id+" "+code_reply+" "+description);

		let ObjectId = require("mongodb").ObjectId;

		rep_comment.find({
			"_id" : ObjectId(rep_comment_id)
		})

		.then(rep_comments => {
			if(rep_comments.length === 0){
				reject({status: 404, message: "Không tìm thấy bình luận !"});
			}else{
				return rep_comments[0];
			}
		})

		.then(rep_comment_one => {
			const code = rep_comment_one.code_reply;
			const id_cmt = rep_comment_one._id;
			// console.log(code+" "+id_cmt+ " "+description);

			if(code_reply === code){
				rep_comment.update({"_id" : ObjectId(id_cmt)}, {$set: {"status" : description}})

				.then(() => {
					resolve({status: 200, message: "Cập nhật thành công !"});
				})
			}else{
				reject({status: 401, message: "Mã code sai !"});
			}

		})

		.catch(err => reject({status: 500, message: "Lỗi Server !"}));


	});


exports.deleteRepComment = (rep_comment_id, code_reply) => 

	new Promise((resolve, reject) => {
		console.log(rep_comment_id+ " " +code_reply);
		let ObjectId = require("mongodb").ObjectId;

		rep_comment.find({
			"_id" : ObjectId(rep_comment_id)
		})

		.then(comments => {
			if(comments.length === 0){
				reject({status: 404, message: "Không tìm thấy bình luận !"});
				console.log("OK 1");
			}else{
				return comments[0];
				console.log("OK 2");
			}
		})

		.then(comment_one => {
			const code = comment_one.code_reply;
			const cmt_id = comment_one._id;

			if(code_reply === code){
				comment_one.remove();

				console.log("OK");

				comment.update({"rep_comment": ObjectId(cmt_id)}, {$pullAll: {rep_comment: [ObjectId(cmt_id)]}})

				.then(() => {
					resolve({status: 200, message: "Đã xóa !"});
				})

			}else{
				reject({status: 401, message: "Mã code sai !"});
			}

		})

		.catch(err => reject({status: 500, message: "Lỗi Server !"}));


	});
