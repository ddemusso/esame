import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import {useNavigate} from "react-router-dom"
import Image from "react-bootstrap/Image"


export default function Register({handleUser, handleUsername}) {

  const [username,setUsername]=useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate=useNavigate();

  function validateForm() {
    return email.length > 0 && password.length > 0 && username.length>0;
  }

  return (
    <div className="Register">

      <figure>
        <Image src="../../logo.png" fluid/>
      </figure>

      <form id="reg" onSubmit={e=>{
        e.preventDefault();
        fetch("http://localhost:8080/api/users/register", {
          method: 'post',
          headers: {"Content-Type": "application/json"}, 
          body: JSON.stringify({
            username: username,
            email: email,
            password:password
          })
        }).then(res=> {
          if (res.ok) return res.json();
          else throw new Error('Si è verificato un errore nella comunicazione con il server');
      }).then(res=> {

        if(res!=="Utente gia esistente")  {
        window.alert("Registrazione avvenuta con successo"); 
        handleUser(res.token); 
        handleUsername(res.username); 
        navigate("/"+res.username);} 
        else 
        window.alert("Utente esistente, non è stato possibile effettuare la registrazione")}).catch(e=> console.log(e))
      }}>

        <div className="InputContainer">

              <div className="usernamediv">
                  <label>Username</label>
                  <input
                  autoFocus
                  name="username"
                  type="text"
                  onChange={(e)=> setUsername(e.target.value)}
                  />
              </div>

              <div className="emaildiv">

                <label>Email</label>
                <input
                  autoFocus
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

              </div>


              <div className="pasdiv">
                  <label>Password</label>
                  <input
                    type="password"
                    name="pass"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
              </div>
              
        </div>
        

        <Button type="submit" block size="lg" disabled={!validateForm()}>Registrazione</Button>
        
      </form>
    </div>
  );
}