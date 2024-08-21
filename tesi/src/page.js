import React from 'react';


import logo from "./openai-logomark.png"
import "./css/home.css";
import { Link } from "react-router-dom";
import { Guida } from "./Guida.js"
import {Comment } from "./Comment.js"
import { logout} from "./firebase.mjs"
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            value2:'',
            data: '',
            loading: "none",
            guide: [],
            block: false,
            clicked: false,
            dati_guida: "",
            spiegazione: "", 
            currentTitle: "",
            comments: false,
            commenti: [], 
            currentComment: "",
            liked:false
           
        };
    }

    

    addComment() {
       
        this.setState({ comments: true, clicked: false });
        let user;
        if (localStorage.getItem("normalEmail")!=null)
            user = JSON.parse(localStorage.getItem("normalEmail")).username
        else user = JSON.parse(localStorage.getItem("Dati")).Nome + JSON.parse(localStorage.getItem("Dati")).Cognome

        const com = {
            testo: this.state.currentComment,
            titolo: this.state.currentTitle,
            autore: this.state.dati_guida,
            user: user


        }

        fetch("http://localhost:4200/api/moderate/" + this.state.currentComment).then((response) => {

            return response.json();

        })
            .then((json) => {
                if (json.ris === false) {
                    this.setState({ data: "Il tuo commento e' inappropriato e non verra' pubblicato!", comments:false, clicked:false });



                }
                else {

                    fetch("http://localhost:4200/api/guides/comments", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(com),
                    })
                    this.showComments();

                }
                


            });


        
    }

   
    
    addLike(event) {
        if (localStorage.getItem("normalEmail") == null) return;
        
        const json = {
            titolo: this.state.currentTitle,
            autore: this.state.dati_guida,
            user: JSON.parse(localStorage.getItem("normalEmail")).username 


        }

        fetch("http://localhost:4200/api/guides/like", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(json),
        })
        
            this.setState({ liked: "Piaciuto" });
        
    }

    addGuide() {
        const json = {
            titolo: this.state.value,
            testo: this.state.data,
            autore:"GPT"
            

        }

        fetch("http://localhost:4200/api/guides/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(json),
        }).then(console.log("Ehi"))
        this.setState({data: "Abbiamo aggiunto questa guida al nostro database, grazie per il tuo contributo!", loading:"none"})
    }

    
    addSuggestions() {
        let us;
        if (localStorage.getItem("Dati") !== null) us = JSON.parse(localStorage.getItem("Dati")).Nome + JSON.parse(localStorage.getItem("Dati")).Cognome;
        else us = JSON.parse(localStorage.getItem("normalEmail")).username;


        const json = {
            auth: this.state.dati_guida,
            sub: this.state.spiegazione,
            text: this.state.value2,
            user: us 
        }
        
        fetch("http://localhost:4200/api/writers/suggestions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(json),
        })
        
    }
    
    getApi() {
        this.setState({ loading: true, clicked:false, commenti:[], comments:false});
        this.setState({ data: '', spiegazione:'' });
        this.setState({ guide: [] });
        if (!this.state.value.startsWith("Come fare a")) {
            this.setState({ data: "La tua ricerca non ha prodotto risultati. Verifica di aver inserito 'Come fare a' come prime parole " })
            this.setState({ loading: false });
            return;
        }

        
        fetch("http://localhost:4200/api/moderate/" + this.state.value).then((response) => {
            
            return response.json();

        })
            .then((json) => {
                if (json.ris === false) {
                    this.setState({ data: "La tua richiesta viola determinati parametri. Non e' stato possibile rispondere" });
                    this.setState({ loading: false, block: true }, () => { this.getApi2() });


                }
                else this.getApi2();
              
                
            });

       

        
    }


    getApi2() {
        if (this.state.block === false)

            fetch("http://localhost:4200/api/find/" + this.state.value).then((response) => {

                return response.json();

            })
                .then((json) => {
                    
                    this.setState({ guide: json.message });
                    this.setState({ loading: "done" });
                })
        this.setState({ block: false });
        

    }



    getExplanation() {
        this.setState({ loading: true })
       
      const  json = {
            text: "'"+this.state.data+"'",
          piece: "'" + this.state.value2+"'"

        }

        fetch("http://localhost:4200/api/explain", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(json),
        })
            .then((response) => {
                
                return response.json();

            })
            .then((json) => {
                this.setState({ spiegazione:json.message.content, loading:"done" })
                
            });

    }

    callGPT() {
        fetch("http://localhost:4200/api/" + this.state.value).then((response) => {

            return response.json();

        })
            .then((json) => {
                this.setState({ data: json.message.content, loading: "done" });

            });
            
    }

    gptAnswer() {
        this.setState({ guide: [], loading: true , data: "Stiamo sottoponendo la tua domanda a GPT, attendi qualche secondo..."}, () => {this.callGPT() })
        
    }

    log_out() {
       
        logout();
        localStorage.removeItem("Dati");
        localStorage.removeItem("Email");
        localStorage.removeItem("normalEmail");
        this.setState({ value: "", guideOn:false, guide:[], clicked:false, comments:false, loading:false });
    }

    removeLike() {
        
        fetch("http://localhost:4200/api/guides/like/remove/" + JSON.parse(localStorage.getItem("normalEmail")).username + "&" + this.state.dati_guida + "&" + this.state.currentTitle).then( this.setState({liked:"Mi piace"}));
    }

    reqGuide() {
        this.setState({data: "Abbiamo preso in carico la tua richiesta. Controlla nei prossimi giorni perche' qualcuno potrebbe aver scritto una guida a riguardo",loading:false})
        fetch("http://localhost:4200/api/requests/" + this.state.value);
    }

    showComments() {
       
       

        fetch("http://localhost:4200/api/guides/comment/get/"+ this.state.dati_guida+"&"+ this.state.currentTitle)
            .then((response) => {

                return response.json();

            })
            .then((json) => {
                this.setState({ commenti: json.message })
                this.setState({clicked:false,comments:true})
            });


    }
        
    showGuide(event) {
        
        this.setState({ clicked: true, dati_guida: event.currentTarget.dataset.autore, currentTitle: event.currentTarget.dataset.titolo, liked: event.currentTarget.dataset.liked });
        this.setState({ data: event.currentTarget.dataset.titolo + ":" +event.currentTarget.dataset.testo, loading:"none"})
        this.setState({ guide: [] });
       
        
           
            
        
        

    }

    
    retrieveData() {

        const loginEmail = JSON.parse(localStorage.getItem("Email")).loginEmail;



        fetch("http://localhost:4200/api/writers/data/" + loginEmail).then((response) => { return response.json() }).then((json) =>
            localStorage.setItem("Dati", (JSON.stringify(json.message[0]))));



    }

    waitForEmail() {
        this.retrieveData();
        this.setState({currentTitle:""})
    }


    render() {
        
        window.addEventListener("login", () => this.waitForEmail())
        window.addEventListener("nlogin", () => this.setState({ spiegazione: "" }));
        let dati, element, int, like, comm;
        
        
        //Like
      
            if (localStorage.getItem("normalEmail") !== null || localStorage.getItem("Dati")!== null ) {
                comm = <div id="com_inv">
                    <textarea id="commentArea" placeholder="Inserisci qui il tuo commento" onChange={(event) => this.setState({ currentComment: event.target.value })}></textarea>
                    <button onClick={() => this.addComment()}>Invia</button>
                </div>
                if (localStorage.getItem("Dati") == null) {
                  if (this.state.liked === "Piaciuto")
                    like = <input type="button" value={this.state.liked} onClick={(event) => this.removeLike(event)}></input>

                   else like = <input type="button" value={this.state.liked} onClick={(event) => this.addLike(event)}></input>
            }
    }
           
        
               
            
        

        let dom;
        if(this.state.dati_guida !== "GPT")
            dom = <><span>Vuoi suggerire all'autore di cambiare la parte di testo evidenziata con quella che hai trovato tu?</span> <br />
                <input type="button" value="Si" onClick={() => this.addSuggestions()}></input></>
        //Guida_dati
        if (this.state.clicked === true) {
            
            dati = <aside id="guida_dati">
                <div id="ind" onClick={() => {
                    this.getApi();
                    this.setState({ clicked: false })
                }}>Indietro</div>
                <pre><span>Autore: {this.state.dati_guida}</span></pre>
                {like }
                <input type="button" value="Visualizza i commenti" onClick={(event) => this.showComments(event)} ></input> <br />
                <textarea id="expArea" placeholder="Inserisci qui una parte di testo che non hai compreso" onChange={(event) => this.setState({ value2: event.target.value })}></textarea><br />
                <input type="button" value="Invia" onClick={() => this.getExplanation()}></input><br />
                <textarea id="explanation" value={this.state.spiegazione} readOnly placeholder="Qui verra' visualizzata la spiegazione" ></textarea><br />
                {dom }

            </aside>
        }//Commenti
        else if (this.state.clicked === false && this.state.comments === true) {
            dati = <aside id="guida_dati">
                <div id="ind" onClick={() => {
                    
                    this.setState({ clicked: true, comments:false })
                }}>Indietro</div><br/>
                 <div id = "com_section">
                {this.state.commenti.map((com, index) => (
                    <Comment key={index} user={com.user} testo={com.testo }/>
                ))}
                    
                </div>
               



                {comm}



              </aside>



        }

        //Menu
        let menu;
        if (localStorage.getItem("Email") == null)
            menu =  < aside id = "menu" >
                    <div className="sec">
                        <Link to="/signup">
                            Registrati
                    </Link></div>
                    <div className="sec">
                        <Link to="/writers">
                       
                            Iscriviti come scrittore
                       
                        </Link></div>
                    <div className="sec">
                        <Link to="/login">

                            Accedi

                    </Link></div>
                <div className="sec">
                    <Link to="/wlogin">

                        Accedi come scrittore

                    </Link></div>
                    
                        
                     </aside>

       else if(localStorage.getItem("Dati")!==null) menu = < aside id="menu" > 

            <div className="sec">

                <Link to="/" onClick={()=>this.log_out() }>Logout</Link>


            </div>
            <div className="sec">

                <Link to="/personal"> Area personale</Link>


            </div>




        </aside>
        
        if (localStorage.getItem("normalEmail") != null)
            menu = < aside id="menu" >
                
                <div className="sec">

                    <Link to="/" onClick={() => this.log_out()}>Logout</Link>


                </div>

            </aside>
      //
        if (this.state.loading === true)
            element = <img alt="" src={logo} id="logo"  style={{ display: this.state.loading }}></img>
        else if (this.state.loading === "done" && this.state.guide?.length !== 0) {
            int = <div id="int"> <span>Hai trovato cio' che ti interessa?</span>

                <button onClick={() => this.gptAnswer()}>No</button>

            </div>
        }
        else if (this.state.loading === "done" && this.state.guide.length === 0 && this.state.clicked ===false) {
            int = <div id="int">
                <span>Questa risposta ti soddifa?</span>
                <button onClick={() => this.addGuide()}>Si</button>
                <button onClick={() => this.reqGuide()}>No</button>
            </div>
        }


        return (
            <div className="homepage">
                <div>
                    <nav id="navhome">
                        <div className="res">
                            <span id="domanda"> Ciao, stai cercando una guida ?</span>
                        </div>
                        <div className="res"><label>
                            <input id="bar" placeholder = "Come fare a...?" onChange={(event) => this.setState({ value: event.target.value })}></input></label>
                        </div>

                        <label>  <input type="button" value="Cerca" onClick={this.getApi.bind(this)} /></label>

                    </nav>
                    <section className="text">
                        {dati }
                        <div id = "spazio_guide">

                            {this.state.guide.map(( guida,index) => (
                            <Guida key={index}  autore={guida.autore} titolo={guida.titolo} testo={guida.testo}  onClick={(event) => this.showGuide(event)} />
                            ))
}
                        </div>
                        <span className="response">  {this.state.data}</span>
                        {menu}


                    </section>
                </div>

                {element}
                {int}
               
                    
                    
                <footer> <pre> <em>Carontech</em>, una guida verso il futuro  <Link to="/chi">

                    Chi siamo

                </Link></pre>  </footer>
                
             </div>
        )
    }
    //ReactDOM.render(<Page />, document.getElementById('root'));
}


/*{
     */  


export { Home };