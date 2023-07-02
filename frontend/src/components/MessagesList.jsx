import React, {useEffect,useState} from "react";
import Message from "./Message"
import Button from "react-bootstrap/Button"

export default function MessagesList ({messageList, friendName, friendId, socket, username})
{

   const [body,setBody]=useState("");
   

   function checkBody()
   {
      return body.length>0;
   }

   useEffect(()=>{
      
      document.getElementById("messagescontainer").scrollTop=99999999;

   })

    return(

    <>
         <div className="chat-name">
            
            <h1> {friendName} </h1>

         </div>

         <div id="messagescontainer">
            {/* Per la visualizzazione dei messaggi devo passare l'id di tutti gli elementi della lista e l'id dell'amico per capire il mittente o il destinatario*/}
            {messageList.messages.map(e=> <Message idMessage= {e} friend={friendId} key={e}/>)}
            
         </div>
         
         
         <div className="chatBar">
            {/*Form per l'invio del messaggio */}
            <form onSubmit={e=> {
               e.preventDefault();
               setBody("");
               socket.emit("SendMessage", {name: username, receiver: friendId, receiverName:friendName, body: body, id: messageList._id});
               e.target.insertMessage.value="";
            }}>
               <input type="text" name="insertMessage" onChange={e=>
                  setBody(e.target.value)
               }></input>
               <Button type="submit" disabled={!checkBody()}>invia messaggio</Button>
            </form>
            
         </div>
            


    </>


    )
    
    
    
}