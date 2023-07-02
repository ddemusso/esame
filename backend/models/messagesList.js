const mongoose=require('mongoose');
const messagesListSchema=mongoose.Schema({
    a1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    a2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    messages: [{
        default: null,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]

});

module.exports=mongoose.model("MessagesList", messagesListSchema);