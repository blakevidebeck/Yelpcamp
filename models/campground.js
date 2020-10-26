const mongoose = require('mongoose');
const Comment = require('./comment');

const campgroundSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	imageId: String,
	description: String,
	createdAt: { type: Date, default: Date.now },
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		username: String,
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment',
		},
	],
});

campgroundSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
	try {
		await Comment.deleteMany({
			_id: {
				$in: this.comments,
			},
		});
		return next();
	} catch (err) {
		next(err);
	}
});

module.exports = mongoose.model('Campground', campgroundSchema);
