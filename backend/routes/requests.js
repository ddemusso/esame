const express=require("express");
const requestsController= require("../controllers/requests");
const router=express.Router();

//Dichiarazione dei middleware da utilizzare per relativo percorso e richiesta effettuata
router.get("/byUsername/:username", requestsController.getRequestsByUsername);
router.post("/addRequest", requestsController.addRequest);
router.post("/removeRequest", requestsController.removeRequest)

module.exports=router;