const express=require("express");
const messagesController= require("../controllers/messages");
const router=express.Router();


//Dichiarazione dei middleware da utilizzare per relativo percorso e richiesta effettuata
router.get("/getLastMessage/:friendName", messagesController.getLastMessage);
router.get("/getMessageById/:id", messagesController.getMessageById);


module.exports=router;