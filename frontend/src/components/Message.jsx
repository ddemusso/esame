import React,{useState,useEffect} from "react"

export default function Message ({idMessage, friend, lD})
{
    const[message,setMessage]=useState({body: null});
    const [hour,setHour]=useState();
    const [day,setDay]=useState({year: 0, month: 0, day: 0});


    function insertHour(d)
    {
        const dat=new Date(d);
        setHour(dat.getHours()+":"+dat.getMinutes());
    }

    function insertDay(d)
    {
        const dat=new Date(d);
        const giorno={year: dat.getFullYear(), month: dat.getMonth(), day: dat.getDate()};
        setDay(giorno);
        
    }

    /* Prelevo il messaggio usando l'id in maniera tale da poter sapere ora e contenuto */
    useEffect(()=>{
        fetch("http://localhost:8080/api/messages/getMessageById/"+idMessage)
        .then(res=>{if(res.ok) return res.json(); else throw new Error("Errore di comunicazione")})
        .then(res=>{insertDay(res.date); insertHour(res.date); setMessage(res)}).catch(e=>console.log(e));
    },[])





    return (
        <>

            {message.author!==friend ? 
            <div className="me">
                <div className="message">
                <span className="myMessage"> {message.body} </span> <span className="myHour">{day.day}/{day.month}/{day.year} {hour}</span>
                </div>
            </div>

            : 
            <div className="other">

                <div className="message">
                <span className="otherMessage"> {message.body} </span> <span className="otherHour"> {day.day}/{day.month}/{day.year} {hour}</span>
                </div>
            </div>
            }       
        </>
            
            
             
    )
}