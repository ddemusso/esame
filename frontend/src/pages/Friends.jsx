import React, {useEffect, useState} from "react"
import Button from "react-bootstrap/Button"
import { useParams } from "react-router-dom";
import Request from "../components/Request"

export default function Friends()
{

    /* Comando utilizzato per prelevare  dal cookie il valore della proprietà token */
    const user=document.cookie.split("; ")
    .find((row) => row.startsWith("token"))
    .split("=")[1];

    const {username}=useParams();
    
    const [searchFriend,setSearchFriend]=useState("");
    const [foundFriend, setFoundFriend]= useState({username: ""});
    const [requestList,setRequestList]=useState([]);

    function validateForm() {
        return searchFriend.length > 0;
      }

      useEffect(() => {
        fetch("http://localhost:8080/api/requests/byUsername/"+ username, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": user
            }
        })
        .then(res=> {if (res.ok) return res.json(); else throw new Error("Connessione non riuscita")})
        .then(res=> {setRequestList(res)}).catch(error=> console.log(error));
      }, []);

    return(
        <>

        <div className="FriendsContainer">

            <div id="friendsBar">
                <h4>Cerca un amico</h4>

                {/*Form di ricerca utente*/}
                <form id="searchFriend" onSubmit={e=>{
                    e.preventDefault();
                    fetch("http://localhost:8080/api/users/findUser", {
                        method: "post",
                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            username: searchFriend,
                            currentUser: username
                        })
                    }).then(res=>{if (res.ok) return res.json(); 
                    else throw new Error ("Si è verificato un errore di connessione")
                    }).then(res=> {if (res=="me")
                    {
                        window.alert("Non puoi mandare la richiesta a te stesso");
                    }
                    else if(res) 
                    setFoundFriend(res); 
                    else setFoundFriend({username: null})}).catch(e=> console.log(e));


                }}>
                    <input type="text" name="friendsText" onChange={e=>{
                        e.preventDefault();
                        setSearchFriend(e.target.value);
                        setFoundFriend({username: ""})
                    }} />
                    <Button block size="lg" type="submit" disabled={!validateForm()}> Ricerca </Button>
                </form>
            </div>

            {(foundFriend.username===null) ? (<div id="unfounduser"><h1>Utente non trovato</h1></div>) : 
             ((foundFriend.username!=="") &&
            <div id="foundUser">
                <form id="userFound" onSubmit={e=>{
                    e.preventDefault();
                    fetch("http://localhost:8080/api/requests/addRequest", {
                        method:"post",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": user
                        },
                        body: JSON.stringify({
                            sender: username,
                            receiver: foundFriend,
                            number: "20"
                        })
                    }).then(res=>{if (res.ok) return res.json(); 
                        else throw new Error ("Si è verificato un errore di connessione")
                        }).then(res=> { 
                            if(res==="Richiesta già effettuata all'utente") window.alert("Richiesta gia inviata"); 
                            else if(res==="Utente già amico") window.alert("Utente già presente nella lista amici");
                            else if(res==="Utente ha inviato richiesta")
                            window.alert("L'utente a cui stai cercando di inviare la richiesta te ne ha già inviata una, accettala");
                            else window.alert("Richiesta inviata");
                            setFoundFriend({username: ""});
                        } ).catch(e=>console.log(e));

                }}>
                    <h1>{foundFriend.username}</h1>
                    <Button block size="lg" type="submit"> Invia amicizia</Button>
                </form>
                
            </div>
        )}

        {/*Div dove verranno visualizzate tutte le richieste di amicizia in sospeso */}
        <div id="listaRichieste">
            <h4>Richieste di amicizia</h4>
            {requestList && requestList.map(e=> <Request requestId={e} loggedUser={username} key={e}/>)}
        </div>

        </div>

        </>
    )
}