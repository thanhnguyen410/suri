const user = require('../models/table_user');

exports.outputSuri = user_id =>

	new Promise((resolve, reject) => {
		
		user.find({user_id: user_id}, { _id: 1, user_id: 1, status:1, created_at: 1 })
  .populate('user_id', 'name')
		.then(users => resolve(users[0]))

		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))
	});