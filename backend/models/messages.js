const mongoose=require('mongoose');
const messageSchema=mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    date: {type: Date, default: Date.now},

    body: String,

});

module.exports=mongoose.model("Message", messageSchema);