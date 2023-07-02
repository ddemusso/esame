import React, {useState,useEffect} from "react"
import {Link} from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function ButtonUser({icon,name,handler,up})
{ 

    const user=document.cookie.split("; ")
    .find((row) => row.startsWith("token"))
    .split("=")[1];

    const [body,setBody]=useState("");


    /* Si ottiene l'ultimo messaggio della lista dei messaggi dell'utente loggato tramite token e dell'utente amico della lista (name) */
    useEffect(()=>{
        fetch("http://localhost:8080/api/messages/getLastMessage/"+name,{
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": user
            }

        }).then(res=>{if(res.ok) return res.json(); else throw new Error("Errore di comunicazione")})
        .then(res=> {console.log(res); setBody(res); console.log("body")});
    }, [ up])

    
    return <li> 
        <Link onClick={e=>{e.preventDefault();
        handler(name);
    
    
    }}> 
    <h2 name="user"> <FontAwesomeIcon icon={icon}/><span> </span>{name}</h2> 
    <div className="lastMessage"><p>{body}</p></div></Link>  </li>
}