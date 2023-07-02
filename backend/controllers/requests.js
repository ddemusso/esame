const secret=require("./users").secret;
const jwt=require("jsonwebtoken");
const User=require("../models/users");
const Request=require("../models/requests");



module.exports={
    getRequestsByUsername: async (req,res)=>{
        try
        {
            const token=req.headers["authorization"];
            if(token==null) return res.sendStatus(401);
            const userToken= jwt.verify(token,secret);
        
            if(userToken.username==req.params.username)
            {
                console.log("Inizio ricerca delle richieste di amicizia");
                User.findOne({username: req.params.username}).then(u=>{console.log(u); console.log(u.requestsList); res.json(u.requestsList); }).catch("Errore comunicazione")
            }
            else
            res.sendStatus(403);
        }
        catch(e)
        {
            console.log(e);
        }

    },

    addRequest: async (req,res) => {

        try
        {
            const token=req.headers["authorization"];
            if(token==null) return res.sendStatus(401);
            const userToken= jwt.verify(token,secret);
        
            const userFound=await User.findOne({username: userToken.username});
        
            if(userToken.username==req.body.sender)
            {
                console.log("Inizio aggiunta richiesta");
                let aux=false;
        
                for(const e of req.body.receiver.requestsList)
                {
                    console.log(e);
                    let r= await Request.findOne({_id: e});
                    console.log(r);
                    let userAux=await User.findOne({_id: r.sender});
                    console.log(userAux);
                    console.log(req.body.sender)
                    if(userAux.username===req.body.sender)
                    {
                        aux=true;
                        console.log("Richiesta già inviata");
                        break;
                    }
                }
                
                if(aux)
                res.json("Richiesta già effettuata all'utente");

                else
                {
                    for(const e of req.body.receiver.friendsList)
                    {
                        let userAux=await User.findOne({_id: e});
                        if(userAux.username == req.body.sender)
                        {
                            aux=true;
                            console.log("Utente gia trovato nella lista amici")
                            break;
                        }  
                    }
        
                    if(aux)
                    res.json("Utente già amico");
                        
                    else
                    {
                        for(const e of userFound.requestsList)
                        {
                            let requestAux=await Request.findOne({_id: e});
                            if(req.body.receiver._id== requestAux.sender.toString())
                            {
                                aux=true;
                                console.log("L'utente selezionato ti ha gia mandato una richiesta, accettala");
                                break;
                            }
                        }

                        if(aux)
                        res.json("Utente ha inviato richiesta");

                        else
                        {
                            const request= await Request.create({sender: userFound._id});
                            console.log("Richiesta creata "+ request)
                            const user=await User.findOne({username: req.body.receiver.username});
                            user.requestsList.push(request._id);
                            await user.save();
                            console.log("Richiesta inviata: "+request+ "all'utente: "+user);
                            res.json("Richiesta inviata");
                        }
                        
                    }
                }
            }
            else
            res.sendStatus(403);
        }
        catch(e)
        {
            console.log(e);
        }
    },
    
    removeRequest: async (req,res)=>{
        try 
        {
            const token=req.headers["authorization"];
            if(token==null) return res.sendStatus(401);
            const userToken=jwt.verify(token,secret);
        
            const userFound=await User.findOne({username: userToken.username});
        
            if(userToken.username==req.body.user)
            {
                console.log("Inizio rimozione richiesta");
                let a=userFound.requestsList.filter(e=> e.toString()!=req.body.reqId);
                userFound.requestsList=a;
                await userFound.save();
                await Request.findByIdAndRemove(req.body.reqId);
                res.json("Richiesta eliminata");
            }
            else
            res.sendStatus(403);
        }
        catch(e)
        {
            console.log(e);
        }
    }
}