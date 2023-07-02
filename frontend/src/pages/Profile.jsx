import React from "react"
import { useEffect,useState} from "react";
import Button from "react-bootstrap/Button"
import Friend from "../components/Friend"
import {faRightFromBracket} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Link, useParams, useNavigate} from "react-router-dom"


export default function Profile ({handleUser})
{
    const navigate=useNavigate();
    
    /*Comando utilizzato per prelevare dal cookie la proprietà token */

    const user=document.cookie.split("; ")
    .find((row) => row.startsWith("token"))
    .split("=")[1];

    const {username}=useParams();

    const [friendsList, setFriendsList]=useState([]);
    const [email,setEmail]=useState("");

    useEffect(()=>{

        console.log(username);
        fetch("http://localhost:8080/api/users/data/byUsername/"+ username, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": user
            }
        })
        .then(res=> {if (res.ok) return res.json(); else throw new Error("Connessione non riuscita")})
        .then(res=> {setFriendsList(res.friendsList);  setEmail(res.email)}).catch(error=> console.log(error));

        console.log(friendsList);
    }, []);


    return (<>

            <div id="userInfo">
                <h4>Informazioni utente</h4>
                <p> {username}</p>
                <p> {email} </p>

                <div id="logout">
                <Link to="/" onClick={e=> {
                    e.preventDefault();
                    handleUser(null);
                    navigate("/");
                }}><Button block size="lg">Log-out <FontAwesomeIcon icon={faRightFromBracket} /></Button></Link>
                </div>

            </div>
                

            <div id="friends">  
            <h4>Lista amici </h4>

            {/*Per ogni amico nella lista amici viene creata una component friend, usando come chiave l'element dell'array che è l'id dei singoli utenti*/}
             {friendsList.map(e=> <Friend friendId={e} handleFriends={setFriendsList} user={user} username={username} key={e}/>)}



            </div>

            
    </>)
}