import React from "react";
import UserList from "../components/UserList"
import {useState,useEffect} from "react"
import MessagesList from "../components/MessagesList"



export default function Home({socket, loggedUser}) {

    socket.emit("ingresso", {username: loggedUser});


    const user=document.cookie.split("; ")
    .find((row) => row.startsWith("token"))
    .split("=")[1];

    const [messagesLists,setMessagesLists]=useState([{_id: "", messages: []}]);
    const [selectedUserId,setSelectedUserId]=useState(null);
    const [selectedUserName, setSelectedUserName]=useState(null);
    const[currentList,setCurrentList]=useState(null);

    /*Variabile di stato utilizzata per permettere il rendering di UsersList e ButtonUser ogni qual volta un messaggio fosse ricevuto */
    const [update, setUpdate]=useState(false);


    function changeUpdate()
    {
        if(update) setUpdate(false);
        else setUpdate(true);
    }

    /* Ottenere tutte le liste dei messaggi che comprendono loggedUser(username) */
    useEffect(()=>{
        let v=[];

        fetch("http://localhost:8080/api/users/getMessagesList/"+loggedUser, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": user
            }
        }).then(res=> {if (res.ok) return res.json(); else throw new Error ("Errore di comunicazione")})
        .then(res=>{ 
            v=res; 
            setMessagesLists(res); 
        }).catch(e=> console.log(e));

        socket.on("receiveMessage", (data)=>{
            console.log("Socket ha ricevuto il messaggio: "+data);
            changeUpdate();
            if(selectedUserName==data.sender || selectedUserName==data.receiver)
            setCurrentList(data.list);
            else
            {
                v.find(e=> e._id==data.list._id).messages=data.list.messages;
                setMessagesLists(v);
            }});
            
            
            return()=>socket.off("receiveMessage");

    }, [currentList,update,selectedUserName,selectedUserId]);
        


        
     

    function changeSelectedUser(friendUsername)
    {
        setSelectedUserName(friendUsername);
        fetch("http://localhost:8080/api/users/getIdByUsername/"+friendUsername).then(res=> {if (res.ok) return res.json(); else throw new Error("Errore di comunicazione")})
        .then(res=>{ 

            setSelectedUserId(res);
            const list= messagesLists.find(e=>  e.a1.toUpperCase()==res.toUpperCase() || e.a2.toUpperCase()==res.toUpperCase());
            setCurrentList(list);

        }).catch(e=>console.log(e));
    }


    return (
        <>
        <div id="main">
            
            <div id="chat">
                {/* UserList crea un elenco di utenti con i quali sono stati scambiati dei messaggi, si passano le liste dei messaggi e il cambio dell'utente*/}
                <UserList loggedUser={loggedUser} handler={changeSelectedUser} up={update}/>
            </div>

            <div id="chat-messages">

                {/* Si passa a messagesList la lista dei messaggi filtrata, si otterrà solo la lista tra utente loggato e selezionato */}
                {(currentList!==null) && <MessagesList messageList={currentList} friendName={selectedUserName} friendId={selectedUserId} socket={socket} username={loggedUser} />}
                
            </div>

        </div>
        
        
        </>
        
    )
}