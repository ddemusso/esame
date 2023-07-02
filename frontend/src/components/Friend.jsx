import React, {useEffect,useState} from "react"
import Button from "react-bootstrap/Button"

export default function Friend({friendId, handleFriends, user, username})
{

    /*Documento dell'amico ritrovato nella fetch successiva, è un oggetto */
    const [friend,setFriend]=useState({username: null});

    useEffect(()=>{
        fetch("http://localhost:8080/api/users/findUserById", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: friendId
            })
        }).then(res=> {if (res.ok) return res.json(); else throw new Error("Errore di comunicazione")}).
        then(res=> setFriend(res)).catch(e=> console.log(e));
        
    }, []);

    return(
        <>
        {(friend!==null) && (
        <div class="friendRow">

            {/*Form utilizzato per l'eliminazione dell'utente dalla lista degli amici*/}
            <form onSubmit={e=>{
                e.preventDefault();
                fetch("http://localhost:8080/api/users/deleteFriend", {
                    method: "post",
                    headers: {
                        "Content-Type" : "application/json",
                        "Authorization": user
                    },
                    body: JSON.stringify({
                        friend: friendId,
                        currentUser: username
                    })
                }).then(res=> {if (res.ok) return res.json(); else throw new Error ("Errore di comunicazione")})
                .then(res=> {
                    setFriend(null); 
                    handleFriends(res); 
                    window.alert("Utente non fa più parte dei tuoi amici");
                }).catch(e=> console.log(e));
            }}>
                <p name="username">{friend.username}</p>
                <Button type="submit">Cancella amico</Button>
            </form>
        </div>)}
        </>
    )
}