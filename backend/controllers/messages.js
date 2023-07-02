const User=require("../models/users");
const MessagesList=require("../models/messagesList");
const Message=require("../models/messages")
const jwt=require("jsonwebtoken");
const secret=require("./users").secret;


module.exports={
    getLastMessage: async (req,res)=>{
        try
        {
            const token=req.headers["authorization"];
            console.log("Ricerca ultimo messaggio");
            if(token==null) return res.sendStatus(401);
        
            const userToken=jwt.verify(token,secret);
            
            const u=await User.findOne({username: userToken.username});
            const u1=await User.findOne({username: req.params.friendName});
            
            const list=await MessagesList.findOne({$and: [
                {$or: [{a1: u._id}, {a2: u._id}]}, {$or: [{a1: u1._id}, {a2: u1._id}]}
            ]})
            
            if(list.messages.length!=0)
            {
                const m=list.messages[list.messages.length-1];
                const mess= await Message.findOne({_id: m})
                if(mess)
                res.json(mess.body)
            }
            else
            {
                res.json("Nessun messaggio");
            }
        }
        catch(e)
        {
            console.log(e);
        }
        
    },

    getMessageById: async (req,res)=>{
        try
        {
            console.log("Ricerca messaggio "+ req.params.id)
            if(req.params.id!="null")
            {
                const m=await Message.findOne({_id: req.params.id});
                if(m)
                res.json(m);
            }
            else
            {
                res.json("Nessun messaggio");
            }
            
        }
        catch(e) 
        {
            console.log(e);
        }
    }
}