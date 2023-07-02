import React from "react";
import { faHouse, faUser, faUsers} from '@fortawesome/free-solid-svg-icons'
import Button from './Button'
import Image from "react-bootstrap/Image"

/*La nav comunque condurra agli URL previsti da ogni singolo pulsante, ma il rendering effettivo delle pagine dipenderà dal token, vedere App.jsx */

export default function Nav ({loggedUser})
{
    return (
        <div id="menu">
            <ul>
                <li><Image src="../../logo2.png" fluid /></li>
                <Button description="Home" url={loggedUser} icon={faHouse} />
                <Button description="Richeste di amiciza" url={"/requests/"+loggedUser} icon={faUsers} />
                {(loggedUser!="") ? 
                (<Button description={loggedUser} url={"/utente/"+loggedUser} icon={faUser} />) :
                (<Button description="Profilo" url={"/utente/"+loggedUser} icon={faUser} />)}
                
                
            </ul>
            
        </div>
    )

}
    