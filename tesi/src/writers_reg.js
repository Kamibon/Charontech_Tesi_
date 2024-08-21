import React from 'react';
import "./css/signup.css";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword,sendEmailVerification } from "firebase/auth";
import { auth } from "./firebase.mjs";
class Writersreg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nome: '',
            cognome: '',
            descrizione: '',
            loginEmail: '',
            registerPassword: '',
            error: '',
            logged:''
        };
    }

    send_data() {
         
        const json = {
            nome: this.state.nome,
            cognome: this.state.cognome,
            descrizione: this.state.descrizione,
            loginEmail: this.state.loginEmail,
            

        }

        

        const email = {

            loginEmail: this.state.loginEmail
        }
        

        fetch("http://localhost:4200/api/writers/reg", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(json),
        })

        localStorage.setItem("Email", JSON.stringify(email));
        dispatchEvent(new Event("login"));
    }

    check(event) {
        if (this.state.nome === "" || this.state.cognome === "" || this.state.cognome === "" || this.state.descrizione === "") {
            event.preventDefault();
            this.setState({ error: "Inserisci tutti i dati" })
            return
        }
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(this.state.loginEmail).toLowerCase()) || this.state.registerPassword.length < 6) {
                event.preventDefault();
             this.setState({ error: "Hai sbagliato ad inserire email o hai inserito una password con meno di 6 caratteri" })
             return
        }
        createUserWithEmailAndPassword(auth, this.state.loginEmail, this.state.registerPassword).then((cred) => sendEmailVerification(cred.user)).then(() => {


            this.setState({ logged: true, error: "Complimenti, sei entrato nel mondo di Carontech!" });
            
        })





            .catch((errore) => {

                console.log(errore)
                event.preventDefault();
                this.setState({ error: "Hai gia' usato questa email" })
                return;
            })
        this.send_data();
    }

    

    render() {
        let reg;
        if (this.state.logged === true)
            reg = <label className="fields"> <Link to="/" id="r_button" >Accedi</Link></label>
        else reg = <label className="fields"><button id="r_button" onClick={(event) => this.check(event)}>Iscriviti come scrittore</button> </label>

            return (
                <div className="signup">
                    <div id="image"> </div>
                    <div id = "form">
                    <h1 className ="scrittori"> Registrazione utenti scrittori </h1>
                    <span className="error">{this.state.error }</span>
                    <form>
                        <label className="fields"> <span>Il tuo nome</span>  <input placeholder='Nome' onChange={(event) => this.setState({ nome: event.target.value })}></input></label> 
                        <label className="fields"> <span>Il tuo cognome</span>   <input placeholder='Cognome' onChange={(event) => this.setState({ cognome: event.target.value })}></input></label> 
                        <label className="fields"> <span>Descrizione</span>  <input placeholder="Che lavoro fai? Hai qualche titolo? Sei esperto in qualcosa? Indicalo qui" onChange={(event) =>
                            this.setState({ descrizione: event.target.value })}></input></label> 
                        <label className="fields"> <span>La tua email</span>   <input placeholder='Email' onChange={(event) => this.setState({ loginEmail: event.target.value })}></input></label> 
                        <label className="fields"> <span>Password</span>   <input type='password' placeholder='Password' onChange={(event) => this.setState({ registerPassword: event.target.value })}></input></label> 
                        
                    </form>
                    {reg }
                    
                    </div>
                </div>
            )
        }
}

export { Writersreg };