const express=require ("express");
const mongoose=require("mongoose");
const cors= require("cors");
const http=require("http");
const router=require("./routes/api");
const {Server}=require("socket.io");

const Message=require("./models/messages");
const MessagesList=require("./models/messagesList")
const User=require("./models/users")


const app=express();

/*Assegnazione dei middleware da utilizzare per l'handler delle richieste */

app.use(cors());
app.use(express.json());

//Assegnazione del router all'url /api
app.use("/api", router);

/*Connessione al DB mongoose */

mongoose.connect("mongodb+srv://ddemusso:poliba00@cluster0.ebp8fse.mongodb.net/progetto?retryWrites=true&w=majority");

const db= mongoose.connection
db.once("open", () => {
    console.log("Connesso al DB")
})


/*Creazione del server che riceverà le richieste utilizzando come handler app */
const server=http.createServer(app);

//Creazione del socket con relative impostazioni
const io=new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

//Definizione del socket e di tutti gli eventi da catturare, gestire e inviare
io.on("connection", (socket) => {
    console.log("Ciao dal socket")

    socket.once("ingresso", (info)=>{
        socket.join(info.username);
        console.log("Utente collegato alla stanza: "+info.username);

        socket.on("SendMessage", (data)=>{
            console.log("Socket elabora messaggio ");
            let user;
            let mex;
            User.findOne({
                username: data.name
            }).then(u=>{
                console.log(u);
                user=u;
                Message.create({
                    author: u._id,
                    receiver: data.receiver,
                    body: data.body
                }).then(mes=> {
                    console.log(mes);
                    mex=mes;
                    MessagesList.findOne({_id: data.id}).then(mL=> {
                        mL.messages.push(mex._id);
                        mL.save();
                        console.log("Prima di inviare risposta");
                        console.log("Invio risposta a stanza "+info.username+" e "+data.receiverName)
                        io.sockets.in(info.username).in(data.receiverName).emit("receiveMessage", {sender: info.username, receiver: data.receiverName, list: mL});
                    }).catch(e=>console.log(e));
                });
            }).catch(e=>console.log(e));
        })
        
    });

   
})

//Il server inizia ad ascoltare eventuali richieste sulla porta 8080

server.listen(8080, "0.0.0.0", ()=>{
    console.log("Server in ascolto")
})

module.exports=io;
