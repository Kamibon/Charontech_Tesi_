// JavaScript source code

import { auth, addUser, fb_app } from "./firebase.mjs";
import { createUserWithEmailAndPassword } from "firebase/auth"

import  React  from "react";
import "./css/signup.css";
import { Link } from "react-router-dom";

class Signup extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            username:'',
            registerEmail: '',
            registerPassword:'',
            error: '',
            logged:false
        };
    }
    

     register= async(event)=> {
         
             if (this.state.username === "") {
                 this.setState({ error: "Non hai inserito un username" });
                 event.preventDefault();
                 return;
             }
             if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(this.state.registerEmail).toLowerCase()) || this.state.registerPassword.length<6) {
                 event.preventDefault();
                 this.setState({ error: "Assicurati di aver inserito un'email corretta e una password di almeno 6 caratteri" });
                 return;
         } 
         

          createUserWithEmailAndPassword(auth, this.state.registerEmail, this.state.registerPassword).then(() => {
             
              const json = {
                  username: this.state.username,
                  loginEmail: this.state.registerEmail
              }
             this.setState({ logged: true, error: "Complimenti, sei entrato nel mondo di Carontech!" });
              localStorage.setItem("normalEmail", JSON.stringify(json));
              dispatchEvent(new Event("nlogin"));
              addUser(fb_app, this.state.registerEmail, this.state.username);
         })
                
         
                 
         
        
         .catch( (errore)=> {
            
            
             event.preventDefault();
             this.setState({ error: "Hai gia' usato questa email" })
             return
         })
         
         
    }

    

   


     

    render() {
        let reg;
        if (this.state.logged === true)
            reg = <label className="fields"> <Link to="/" id="r_button" >Accedi</Link></label>
        else reg = <label className="fields"><button id="r_button" onClick={(event) => this.register(event)}> Registrati</button> </label>
        return (
            <div className="signup">
                <div id="image"> </div>
                <div id = "form">
                <h1>
                    Carontech
                    
                </h1> 

                <h3>Powered by ChatGPT</h3>

                < form  >
                    <label className="fields"><span> Username</span> <input name="username" id='username' onChange={(event) => this.setState({ username: event.target.value })}></input></label>
                    <label className = "fields"><span> Email</span> <input name="email" id='email' onChange={(event)=>this.setState({ registerEmail:event.target.value })}></input></label>
                    <label className = "fields"> <span> Password</span> <input type="password" name="password" id='password' onChange={(event) => this.setState({ registerPassword: event.target.value })}></input></label>
                    
                </form >
                {reg}
                    <span className="error">{this.state.error}</span>
                </div>
            </div>
        )
        

    }

}

export { Signup }  ;
