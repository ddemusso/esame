const mongoose=require('mongoose');
const requestsSchema=mongoose.Schema({
    
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

});

module.exports=mongoose.model("Request", requestsSchema);