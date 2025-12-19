# Applicazione di Messaggistica Istantanea con Gestione Amicizie

## Descrizione del progetto
Questo progetto implementa un’applicazione web di messaggistica istantanea con funzionalità di gestione delle amicizie per la comunicazione tra utenti. L’applicazione consente lo scambio di messaggi in tempo reale e la creazione di relazioni di amicizia.

Il sistema è composto da un backend sviluppato in Node.js e da un frontend sviluppato in React. La persistenza dei dati è gestita tramite un database NoSQL basato su MongoDB. La comunicazione in tempo reale è implementata tramite Socket.IO, permettendo la ricezione immediata dei messaggi senza necessità di ricaricare la pagina.

---

## Tecnologie utilizzate
- Node.js con framework Express per il backend
- React per il frontend
- MongoDB come database NoSQL
- Mongoose per la gestione della connessione e dei modelli dati
- Socket.IO per la messaggistica real-time
- Docker e Docker Compose per l’orchestrazione dei servizi

---

## Struttura del progetto
Il repository è organizzato come segue:
- `backend/`: contiene il server Node.js, le API REST, i modelli e la logica applicativa
- `frontend/`: contiene l’applicazione React e l’interfaccia utente
- `docker-compose.yml`: definisce e orchestra i servizi backend e frontend

---

## Avvio dell’applicazione

### Prerequisiti
Per l’esecuzione del progetto è necessario avere installati Docker e Docker Compose sul sistema.

### Avvio tramite Docker Compose
L’avvio dell’applicazione non avviene in modo separato per backend e frontend, ma tramite Docker Compose, che si occupa della creazione e dell’esecuzione dei container necessari.

Posizionarsi nella directory principale del progetto (dove è presente il file docker-compose.yml) ed eseguire il comando docker compose up --build.

Docker Compose provvederà automaticamente a:
- costruire le immagini del backend e del frontend
- installare le dipendenze necessarie
- avviare i container dei due servizi

---

## Utilizzo dell’applicazione
Una volta completato l’avvio tramite Docker Compose, l’applicazione è accessibile dal browser all’indirizzo:

http://localhost:3000

Da questo indirizzo è possibile utilizzare tutte le funzionalità di messaggistica istantanea e di gestione delle amicizie. Le chat sono gestite in tempo reale grazie all’implementazione di Socket.IO.

---

## Configurazione del database MongoDB
L’applicazione utilizza MongoDB come database NoSQL per la gestione degli utenti, delle relazioni di amicizia e dei messaggi.

È possibile utilizzare un database MongoDB proprietario modificando l’URI di connessione nel backend.  
La stringa di connessione è definita nel file `index.js` presente nella cartella `backend`, all’interno della configurazione di mongoose.connection.

Sostituendo l’URI esistente con quello del proprio database MongoDB (locale o remoto) è possibile collegare l’applicazione a un’istanza diversa, ad esempio un cluster MongoDB Atlas personale.

---

## Comunicazione in tempo reale
La funzionalità di chat è implementata tramite Socket.IO, che consente la comunicazione bidirezionale tra client e server e garantisce lo scambio dei messaggi in tempo reale tra gli utenti connessi.

---

## Note finali
Il progetto è pensato per scopi didattici e dimostrativi. L’architettura adottata, basata sulla separazione tra frontend e backend, sull’uso di un database NoSQL e sulla comunicazione real-time, costituisce una base solida per lo sviluppo di applicazioni di messaggistica moderne.
