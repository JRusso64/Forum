const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'} 
})


const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: {
        type: [commentSchema],
        required: true
    },
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
})

module.exports = mongoose.model('Post', postSchema);