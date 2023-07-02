import React from "react";
import ButtonUser from "./ButtonUser"
import {useState,useEffect} from "react"
import {faUser} from "@fortawesome/free-solid-svg-icons"

export default function UserList ({loggedUser, handler, up})
{

    const user=document.cookie.split("; ")
    .find((row) => row.startsWith("token"))
    .split("=")[1];

    const [names,setNames]=useState([]);

    /* Si ottengono tutti i nominativi degli utenti presenti nelle messagesList, confrontare con il nome dell'utente loggato presente nel token */
    useEffect(()=> {

        fetch("http://localhost:8080/api/users/getUsernameFriends/"+loggedUser, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": user
            }
        }).then(res=> {if(res.ok) return res.json(); else throw new Error("Errore di comunicazione")})
        .then(res=> {console.log(res);setNames(res); console.log(names)});

    }, []);



    return <ul>
        {/*Si crea un ButtonUser per ogni utente amico ritrovato, la key può essere lo username in quanto per come è stata progettata l'app è univoco per ogni utente */}
        { (names.length>0) && (names.map(e=> <ButtonUser icon={faUser} name={e} handler={handler} up={up} key={e}/>))}
    </ul>
}