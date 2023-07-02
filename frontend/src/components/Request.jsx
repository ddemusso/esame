import React, {useEffect, useState} from "react"
import Button from "react-bootstrap/Button"

export default function Request({requestId,loggedUser}){

    const token=document.cookie.split("; ")
    .find((row) => row.startsWith("token"))
    .split("=")[1];


    const [userFriend,setUserFriend]=useState(null)

    useEffect(()=> {
        console.log({requestId})
        fetch("http://localhost:8080/api/users/findUserByRequest", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: requestId
            })
        }).then(res=> {if(res.ok) return res.json(); else throw new Error("Connessione non riuscita")})
        .then(res=> setUserFriend(res)).catch(e=> console.log(e));

    }, []);


    return(<>

    {(userFriend!==null) && (

    <div className="request">
        
            <span name="username"> {userFriend} </span>

            {/*Bottone utilizzato per aggiungere utente agli amici */}

            <Button  onClick={e=>{
                e.preventDefault();
                fetch("http://localhost:8080/api/users/addFriend",{
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    },
                    body: JSON.stringify({
                        friend: userFriend,
                        user: loggedUser,
                        reqId: requestId
                    })
                }).then(res=> {if(res.ok) return res.json(); else throw new Error("Problema di comunicazione")})
                .then(res=>{window.alert("Richiesta accettata"); setUserFriend(null)}).catch(e=> console.log(e));
            }}>Accetta amicizia</Button>


            {/*Bottone utilizzato per rimuovere l'utente dagli amici */}
            <Button onClick={e=>{
                fetch("http://localhost:8080/api/requests/removeRequest", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    },
                    body: JSON.stringify({
                        user: loggedUser,
                        reqId: requestId
                    })
                }).then(res=> {if (res.ok) return res.json(); else throw new Error("Errore di comunicazione")})
                .then(res=>{window.alert(res); setUserFriend(null)}).catch(e=>console.log(e));
            }}> Rifiuta amicizia </Button>
        
        
        
    </div>)}

    

    </>)
}