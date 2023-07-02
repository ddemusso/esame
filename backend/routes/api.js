const express = require("express");
const usersRouter= require("./users");
const messagesRouter=require("./messages");
const requestsRouter=require("./requests")


const router=express.Router();

//Assegnazione router in base ai percorsi
router.use("/users", usersRouter);
router.use("/messages",messagesRouter);
router.use("/requests",requestsRouter);


module.exports=router;