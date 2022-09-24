const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'} 
})

module.exports = mongoose.model('Comments', commentSchema);