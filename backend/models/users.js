const mongoose= require('mongoose');
const userSchema= mongoose.Schema(
    {
        username : String,
        email : String,
        password: String,

        friendsList: [{
            default: null,
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],

        requestsList: [{
            default: null,
            type: mongoose.Schema.Types.ObjectId,
            ref:"Request"
        }]
    }
)


module.exports=mongoose.model("User", userSchema);