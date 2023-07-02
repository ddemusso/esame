import './App.css';
import {Routes,Route} from "react-router-dom";
import {useState,useEffect} from "react"
import Nav from "./components/Nav"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import Friends from "./pages/Friends"
import Cookies from "universal-cookie"
import io from "socket.io-client"

//Si apre la connessione verso il socket
const socket=io.connect("http://localhost:8080")


//Si istanzia il cookie necessario per lo storage del token
const cookies= new Cookies();



function App() {

  const [username,setUsername]=useState("");

  function setLoggedUser(token)
  {
    if(token==null)
    {
      console.log("Cancellazione cookie");
      //Comando utilizzato per rimozione del cookie
      cookies.remove('token', {
        path: '/',
      });
      console.log(document.cookie);
      setUsername("");
    }

    else
    {
      //Comando utilizzato per impostare il parametro del cookie relativo al token
      cookies.set("token", token, {
        path: "/",
        maxAge: 1000000
      });
  
    }
    
  }

  useEffect(()=>{
    
    //ad ogni rendering dell'app si verificherà se il token è null per scegliere se far visualizzare le pagine di login e register oppure il resto del sito
    if(!cookies.get("token"))
    {
      console.log("nessun utente settato");
    }  
    else
    {
      console.log("Utente settato: "+ cookies.get("token"));
      fetch("http://localhost:8080/api/users/findUsernameByToken", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "Authorization": cookies.get("token")
        }
      }).then(res=> {if(res.ok) return res.json(); else throw new Error("Errore di comunicazione")})
      .then(res=> setUsername(res));

    }

  }, [username])



  return (
    <div className="container">
      <Nav loggedUser={username}/>
        <main id="principale">

        

          { (username=="") ? 
          (<>

            <Routes>
              <Route path="/registrazione" element={<Register handleUser={setLoggedUser} handleUsername={setUsername} />} /> 
              <Route path="/utente/:username" element={<Login handleUser={setLoggedUser} handleUsername={setUsername}/> } />
              <Route path=":username" element={<Login handleUser={setLoggedUser} handleUsername={setUsername}/> } />
              <Route path="/newChat/:username" element={<Login handleUser={setLoggedUser} handleUsername={setUsername}/> } />
              <Route path="/requests/:username" element={<Login handleUser={setLoggedUser} handleUsername={setUsername}/> } />
              <Route path="/" element={<Login handleUser={setLoggedUser} handleUsername={setUsername}/> } />
            </Routes>
          </>) : 

            (<Routes>
              <Route path=":username" element={<Home socket={socket} loggedUser={username}/>} />
              <Route path="/utente/:username" element={<Profile handleUser={setLoggedUser}/>} />
              <Route path="/requests/:username" element={<Friends />}/>
            </Routes>)}
        
        </main>
        
    </div>
    
  );
}

export default App;
