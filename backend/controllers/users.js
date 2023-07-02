const User=require("../models/users");
const MessagesList=require("../models/messagesList");
const Message=require("../models/messages")
const Request=require("../models/requests");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const secret=require("crypto").randomBytes(64).toString('hex');

module.exports= {
    secret: secret,

    findUser: (req,res) =>{
        console.log("Inizio ricerca")
        User.findOne({username: req.body.username}).
        then(r=>{ 
            if(r && r.username!=req.body.currentUser)
            res.json(r);
            
            else if(r && r.username==req.body.currentUser)
            res.json("me");

            else
            res.json(null);

          })
        .catch(e=> console.log(e));
    },

    findUserByRequest: async (req,res) => {
        try
        {
            console.log("Inizio ricerca utente tramite richiesta");
            const request=  await Request.findOne({_id: req.body.id});
            const user= await User.findOne({_id: request.sender});
            res.json(user.username);
        }
        catch(e)
        {
            console.log(e);
        }
        
    },

    register: async (req,res) => {
        try
        {
            console.log("Inizio registrazione")
            const u=await User.findOne({username: req.body.username});
            const u1=await User.findOne({email: req.body.email});
    
            if(u===null && u1===null)
            {
                console.log("Inserimento possibile");
                const user= { username: req.body.username, email: req.body.email, password: req.body.password}
                const pass=await bcrypt.genSalt(10);
                const passc=await bcrypt.hash(user.password,pass);
                const createUser=await User.create({username: user.username, email:user.email, password: passc});
                console.log("Registrazione completata");
                const token=jwt.sign({username: createUser.username, email: createUser.email, password: createUser.password}, secret, {expiresIn: "6000s"});
                res.json({token: token, username: createUser.username});
            }
            else
            {
                res.json("Utente gia esistente");
            }   
        }
        catch(e)
        {
            console.log(e);
        }
        
    },


    login: async (req,res)=>{
        try
        {
            console.log("Inizio accesso");
            const user=await User.findOne({email: req.body.email});
        
            if(user)
            {
                const a=await bcrypt.compare(req.body.password, user.password);
                console.log(a);

                if(a)
                {
                    console.log("Utente trovato");
                    console.log(user);
                    const token=jwt.sign({username: user.username, email: user.email, password: user.password}, secret, {expiresIn: "6000s"});
                    res.json({token: token, username: user.username});
            
                }
                else 
                res.json("Credenziali non valide");
            }
            else
            res.json("Credenziali non valide");
            console.log("fine accesso");
         }
         catch(e)
         {
            console.log(e);
         }
        
     },

     findUsernameByToken: async (req,res)=> {
        try{

            const token=req.headers["authorization"];
            if(token==null) return res.sendStatus(401);
            const userToken=jwt.verify(token,secret);
            return res.json(userToken.username);
        }
        catch(e)
        {
            console.log(e);
        }
        
    
    
    },

    getData: async (req,res)=>{

        try
        {
            const token=req.headers["authorization"];
        
            if(token==null) return res.sendStatus(401);
        
            const userToken=jwt.verify(token,secret);
        
            console.log("Inizio ricerca della lista amici");

            const u=await User.findOne({username: req.params.username});
        
            if(u.username==userToken.username)
            res.json({friendsList: u.friendsList, email: u.email});

            else
            res.sendStatus(403);
        }
        catch(e)
        {
            console.log(e);
        }
    },

    findUserById: (req,res) => {
        console.log("Inizio ricerca utente tramite id");
        User.findOne({_id: req.body.id}).then(r=> {res.json(r); console.log("Utente trovato: "+ r)}).catch(e=> console.log(e));
    },

    addFriend: async (req,res) =>{

        try
        {
            const token=req.headers["authorization"];
            if(token==null) return res.sendStatus(401);
            const userToken=jwt.verify(token,secret);
        
            if(userToken.username==req.body.user)
            {
                console.log("Inizio scambio amicizia");
                const u= await User.findOne({username: req.body.user})
                const u1= await User.findOne({username: req.body.friend})
                
                u.friendsList.push(u1._id);
                u1.friendsList.push(u._id);
               
                const arr= u.requestsList.filter(e=> e!=req.body.reqId);
                
                u.requestsList=arr;

                console.log("Richiesta eliminata");

                await u.save();
                await u1.save();
                await Request.findByIdAndRemove(req.body.reqId);
                MessagesList.create({a1: u._id, a2: u1._id}).then(r=> console.log("Lista messaggi creata: "+r)).catch(e=>console.log(e));

                console.log("Utente: "+u+" e : "+u1+" sono amici")

                res.json("Richiesta scambiata");    
            }
            else
            res.sendStatus(403);
        }
        catch(e)
        {
            console.log(e);
        }
        
    
        
    },

    deleteFriend: async (req,res) => {
    
        try
        {
            const token=req.headers["authorization"];
            if(token==null) return res.sendStatus(401);
            const userToken=jwt.verify(token,secret);
        
            if(userToken.username==req.body.currentUser)
            {
                console.log("Inizio eliminazione amicizia");
                const user= await User.findOne({username: req.body.currentUser});
                
            
                const user1=await User.findOne({_id: req.body.friend});
                
                const a=user.friendsList.filter(e=> e!= req.body.friend);
                const v=user1.friendsList.filter(e=> e!=user._id.toString());
                
                user.friendsList=a;
                user1.friendsList=v;

                await user.save();
                await user1.save();

                const list=await MessagesList.findOne({$and: [
                    {$or: [{a1: user._id}, {a2: user._id}]}, {$or: [{a1: req.body.friend}, {a2: req.body.friend}]}
                ]})

                list.messages.forEach(e=> { Message.findByIdAndRemove(e.toString()).catch(e=>console.log(e)) })

                await MessagesList.findByIdAndRemove(list._id);
                
                res.json(user.friendsList);
            }
        }
        catch(e)
        {
            console.log(e);
        }
    },

    getMessagesLists: async (req,res) => {
        try
        {
            console.log("Inizio ricerca di tutte le chat");
            const token=req.headers["authorization"];
            
        
            if(token==null) return res.sendStatus(401);
        
            const userToken=jwt.verify(token,secret);
        
            const u=await User.findOne({username: req.params.username});
        
            if(userToken.username==u.username)
            {
                const list= await MessagesList.find({$or: [{a1: u._id } , {a2: u._id}]});
                res.json(list);
            }
            else
            res.sendStatus(403);
        }
        catch(e)
        {
            console.log(e);
        }
        
    },

    getIdByUsername: async (req,res) => {

        try
        {
            console.log("Username in ricerca");
            u=await User.findOne({username: req.params.username})
            if(u)
            res.json(u._id);
        }
        catch(e)
        {
            console.log(e);
        }
        
    },

    getUsernamesFriends: async (req,res)=>{
        try
        {
            const names=[];
    
            const token=req.headers["authorization"];
            console.log("Ricerca username degli amici")
            
        
            if(token==null) return res.sendStatus(401);
        
            const userToken=jwt.verify(token,secret);
        
            
            const u=await User.findOne({username: req.params.username});
        
            if(u.username==userToken.username)
            {   
                for(const id of u.friendsList)
                {
                    const a=await User.findOne({_id: id});
                    if(a)
                    names.push(a.username);
                    
                }
            }
            else
            res.sendStatus(403);
        
            res.json(names);
        }
        catch(e)
        {
            console.log(e);
        }
        
    }
}