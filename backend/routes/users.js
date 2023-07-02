const express=require("express");
const usersController= require("../controllers/users");
const router=express.Router();


//Dichiarazione dei middleware da utilizzare per relativo percorso e richiesta effettuata
router.post("/register", usersController.register);
router.post("/login", usersController.login);
router.get("/findUsernameByToken", usersController.findUsernameByToken);
router.get("/data/byUsername/:username", usersController.getData);
router.post("/findUserById", usersController.findUserById);
router.post("/deleteFriend", usersController.deleteFriend);
router.get("/getMessagesList/:username", usersController.getMessagesLists);
router.get("/getIdByUsername/:username", usersController.getIdByUsername);
router.get("/getUsernameFriends/:username", usersController.getUsernamesFriends);
router.post("/findUser", usersController.findUser);
router.post("/findUserByRequest", usersController.findUserByRequest);
router.post("/addFriend", usersController.addFriend);

module.exports=router;