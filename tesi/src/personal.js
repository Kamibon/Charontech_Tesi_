import React from 'react';

import { Link } from "react-router-dom";
import "./css/personal.css";
import {Guida } from "./Guida.js"
import { Request } from "./request.js";
import { Advice } from "./advice.js";
import {logout, auth, changeEmail } from "./firebase.mjs"
class Personal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            richieste: [],
            suggerimenti: [],
            descrizione: "",
            aux1:[],
            aux2: [],
            aux3:[],
            guide: [],
            guideOn: false,
            dataOn:false,
            nome: "Titolo della tua guida",
            writing: false,
            titolo: "",
            testo: "",
            changingData: false,
            changeGuide:false,
            message: "",
            dataToChange: "",
            inputValue: "",
            actualText: "",
            updated:false,
            user: "", 
           
            
        };
    }

    componentDidMount() {
        
        this.fillAux1()
        this.fillAux2()
        this.fillAux3()
        
       
    }

    componentDidUpdate() {
        if (this.state.aux3.length !== this.state.guide.length && this.state.guideOn === true)
            this.setState({ guide: this.state.aux3 });
        if (this.state.updated === true) this.setState({ guide: this.state.aux3 }, () => this.setState({ updated: false }));
    }

    

    addGuide() {
        const guida = {
            titolo: this.state.titolo||this.state.nome,
            testo: this.state.testo,
            autore: JSON.parse(localStorage.getItem("Dati")).Nome + JSON.parse(localStorage.getItem("Dati")).Cognome


        }

        fetch("http://localhost:4200/api/moderate/" + this.state.titolo+this.state.testo).then((response) => {

            return response.json();

        })
            .then((json) => {
                if (json.ris === false) {
                    this.setState({ message: "Il tuo testo contiene contenuto non conforme al nostro regolamento e non verra' caricato" });



                }
                else {
                    fetch("http://localhost:4200/api/guides/add", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(guida),
                    })
                    this.fillAux3();
                    this.showGuides();
                   

                }



            });
       
        


    }

    

    fillAux1() {
        let des = JSON.parse(localStorage.getItem("Dati")).Descrizione;

        fetch("http://localhost:4200/api/requests/get/" + des).then((response) => {

            return response.json();

        })
            .then((json) => {
                
                this.setState({ aux1: json.message });


            })
    }

    fillAux2() {
        fetch("http://localhost:4200/api/writers/suggestions/" + JSON.parse(localStorage.getItem("Dati")).Nome + JSON.parse(localStorage.getItem("Dati")).Cognome).then((response) => {

            return response.json();

        })
            .then((json) => {
               
                this.setState({ aux2: json.message });

            })
    }

    fillAux3() {

        fetch("http://localhost:4200/api/writers/guides/" + JSON.parse(localStorage.getItem("Dati")).Nome + JSON.parse(localStorage.getItem("Dati")).Cognome).then((response) => {

            return response.json();

        })
            .then((json) => {

                this.setState({ aux3: json.message } );
                
                
            })
    }

    fill_Guides() {
        fetch("http://localhost:4200/api/writers/guides/" + JSON.parse(localStorage.getItem("Dati")).Nome + JSON.parse(localStorage.getItem("Dati")).Cognome).then((response) => {

            return response.json();

        })
            .then((json) => {

                this.setState({ guide: json.message });
                console.log(json.message)

            })

    }

    log_out() {
        
        logout();
        localStorage.removeItem("Dati");
        localStorage.removeItem("Email");
    }


    retrieveData() {

        const loginEmail = JSON.parse(localStorage.getItem("Email")).loginEmail;



        fetch("http://localhost:4200/api/writers/data/" + loginEmail).then((response) => { return response.json() }).then((json) =>
            localStorage.setItem("Dati", (JSON.stringify(json.message[0]))));



    }

    showData() {
        this.setState({ guide: [], changingData: false })
        this.setState({ richieste: [] })
        this.setState({ suggerimenti: [] });
        this.setState({ guideOn: false, writing: false, dataOn: true, message: "", testo:"", actualText:"", changeGuide:false });

    }
   
    showGuides() {
        this.setState({ suggerimenti: [], richieste: [], changingData:false })
        
        this.setState({ guide: this.state.aux3 });
        this.setState({ guideOn: true, writing: false, dataOn: false, message: "", testo: "", actualText: "", changeGuide: false });
    }

    showRequests() {
        this.setState({ guide: [], changingData: false })
        this.setState({suggerimenti:[]})
        this.setState({ richieste: this.state.aux1 });
        this.setState({ guideOn: false, writing: false, dataOn: false, message: "", testo: "", actualText: "", changeGuide: false });
    }

    showSuggestions() {
        this.setState({ guide: [] })
        this.setState({ richieste: [] })
        this.setState({ suggerimenti: this.state.aux2 });
        this.setState({ guideOn: false, writing: false, dataOn: false, message: "", testo: "", actualText: "", changeGuide: false });
       
    }

    updateData(campo, valore) {

        if (valore === "") {
            this.setState({message:"Non puoi modificare con un campo vuoto"})
            return;
        }

        

        const json = {
            loginEmail: JSON.parse(localStorage.getItem("Dati")).loginEmail,
            campo: campo,
            valore: valore,
            
        }

        const email = {loginEmail:valore}
        

        if (campo === "email") {
            changeEmail(auth.currentUser, valore);
            localStorage.setItem("Email", JSON.stringify(email));
        }

        

        fetch("http://localhost:4200/api/writers/data/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(json),
        })
       
        this.setState({message:"Vedrai aggiornati i tuoi dati al prossimo ingresso sul tuo profilo", changingData:false})
       
        
       
    }

    updateGuide() {
        const json = {
            autore: JSON.parse(localStorage.getItem("Dati")).Nome + JSON.parse(localStorage.getItem("Dati")).Cognome,
            testo:this.state.testo,
            titolo: this.state.nome

        }
        


        fetch("http://localhost:4200/api/guides/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(json),
        }).then(this.setState({ message: "Vedrai aggiornata la tua guida al tuo prossimo ingresso",  writing: false, guide:[] }, () => this.fillAux3()))
        
       
        
    }

    writeNew() {
        this.setState({ guide: [], nome:"", richieste: [], suggerimenti: [], writing: true, guideOn: false });
    }

    writeNewWithTitle(event) {
        
        this.setState({ guide: [], richieste: [], suggerimenti: [], nome: event.currentTarget.dataset.testo, writing: true, guideOn: false });


    }

    writeUpdate(event) {
        this.setState({changeGuide:true, guide: [], richieste: [], suggerimenti: [], nome: event.currentTarget.dataset.titolo, writing: true, actualText: event.currentTarget.dataset.testo, guideOn: false });
    }

    render() {
        window.addEventListener("remove", () => this.fillAux2(),()=>this.showRequests())
        
        let button,data, write;

        //Cambia dati
        if (this.state.changingData ===true) {
            data =<div id = "dataValues"> 
                <input placeholder={"Nuova  " + this.state.dataToChange} onChange={(event) => this.setState({inputValue: event.target.value}) } />
                <button onClick={() => this.updateData(this.state.dataToChange, this.state.inputValue) }>Invia</button> </div>
        }

        else data = <span id="dataValues">{this.state.message}</span>
        //


        //Lista guide
        if(this.state.guideOn ===true)
            button = <button id="Scrivi" onClick={() => this.writeNew()}> Scrivi una nuova guida</button>


       // Scrivi e aggiorna
        if (this.state.writing === true && this.state.changeGuide === false ) {
            write = <div className="writing">
                <label>   <input id="titolo_guida" placeholder="Scrivi qui il titolo  della guida" defaultValue={this.state.nome} onChange={(event) => this.setState({ titolo: event.target.value })} /></label>
                <textarea id="testo_guida" placeholder="Scrivi qui la guida" onChange={(event) => this.setState({ testo: event.target.value })} ></textarea>
            </div>
            button = <button onClick={() => this.addGuide()}>Aggiungi guida </button>
        }
        else if (this.state.writing === true && this.state.changeGuide ===true) {
            write = <div className="writing">
                <span>  {this.state.nome} </span>
                <textarea id="testo_guida"  defaultValue={this.state.actualText} onChange={(event) => this.setState({ testo: event.target.value })} ></textarea>
            </div>
            button = <button onClick={() => this.updateGuide()}>Aggiorna guida </button>
        }
            //Mostra dati
        else if (this.state.dataOn) {
            write =<>
            <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Cognome</th>
                            <th>Email <span onClick={()=>this.setState({dataToChange:"email",changingData:true}) }>Modifica</span></th>
                            <th>Descrizione <span onClick={() => this.setState({ dataToChange: "Descrizione", changingData: true })}>Modifica</span></th>
                 </tr>
                </thead>
                 <tbody>
                    <tr>
                        <td>{JSON.parse(localStorage.getItem("Dati")).Nome }</td>
                        <td>{JSON.parse(localStorage.getItem("Dati")).Cognome}</td>
                        <td>{JSON.parse(localStorage.getItem("Dati")).loginEmail}</td>
                        <td>{JSON.parse(localStorage.getItem("Dati")).Descrizione}</td>
                    </tr>
               
            </tbody>
                
            </table>
               </>
        }

        return (<div id="container" >
            {write}
            {data }
            <nav>
                
                <div className="sec" onClick={this.showRequests.bind(this) }> Richieste <span className="number"> {this.state.aux1.length }</span> </div>
                <div className="sec" onClick={ this.showSuggestions.bind(this)}> Suggerimenti  <span className="number">{this.state.aux2.length}</span> </div>
                <div className="sec" onClick={ this.showGuides.bind(this)}> Guide scritte  </div>
                <div className="sec" onClick={this.showData.bind(this)}> Dati personali  </div>

                <div className="sec"><Link to="/">
                   
                        Home
                   
                </Link>  </div>
                <div className="sec" ><Link to="/" onClick={() => this.log_out()}> Logout</Link> </div>
                

            </nav>
            <div className="richieste">
                
                {this.state.richieste.map((ric,index) => (
                    <Request key={index} testo={ric.payload.richiesta} onClick={(event) => this.writeNewWithTitle(event)} />
                ))
                    }
               
                {
                    this.state.suggerimenti.map((ric, index) => (
                        <Advice key={index} testo={ric.text} sub={ric.sub} user={ric.user} />
                    ))
                }
                {
                    this.state.guide.map((ric, index) => (
                        <Guida key={index} testo={ric.testo} titolo={ric.titolo} autore={ric.autore} onClick={(event) => this.writeUpdate(event)} />
                ))
                }
                
                {button }

            </div>

            <div>
               
            </div>
           

        </div>)
    }


}

export { Personal };
/* */