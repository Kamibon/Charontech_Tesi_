import {  signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth } from "./firebase.mjs";
import React from "react";
import "./css/signup.css";
import { Link } from "react-router-dom";


class WLogin extends React.Component {

    
    constructor(props) {
        super(props);
        this.state = {
           
            loginEmail: '',
            loginPassword: '',
            error: '',
            ok:false
        };
    }

   
    

    login = async (event) => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(this.state.loginEmail).toLowerCase()) || this.state.loginPassword.length < 6) {
            event.preventDefault();
            this.setState({ error: "Assicurati di aver inserito un'email corretta e una password di almeno 6 caratteri" })
            return;
        }
        event.preventDefault();
        fetch("http://localhost:4200/api/writers/data/" + this.state.loginEmail).then((response) => { return response.json() }).then((json) =>
        {
            if (json.message.length === 0) {
                this.setState({ error: "Questa email non e' presente nel nostro database. Assicurati di averla scritta correttamente" })
               
            }

        })

        
        const json = {
            
            loginEmail: this.state.loginEmail
        }
        
        try {
            await signInWithEmailAndPassword(auth, this.state.loginEmail, this.state.loginPassword)
           
        }
        catch (error) {
            //console.log(error)
             event.preventDefault();
            this.setState({ error: "Assicurati di aver inserito un'email corretta e una password di almeno 6 caratteri" });
            return;
        }
        
       
        this.setState({ok:true, error: "Bentornato su Carontech. Clicca su accedi per entrare"})
        localStorage.setItem("Email", JSON.stringify(json));
        dispatchEvent(new Event("login"));
        
    }

   


    logout = async () => {
        signOut(auth);

    }

    
    

    render() {
        let acc;
        if(this.state.ok === true) acc =
        <label id = "r_button" className="fields"> <Link to="/" >Accedi</Link></label>

        else acc = <button id="r_button" onClick={this.login}>Accedi</button>

        return (
            <div className="signup" >
                <div id="image"> </div>
                <div id = "form">
                <h1>
                    Carontech

                </h1>

                <h3>Powered by ChatGPT</h3>

                < form >
                    
                    <label className="fields"><span> Email</span> <input name="email" id='email' onChange={(event) => this.setState({ loginEmail: event.target.value })}></input></label>
                    <label className="fields"> <span> Password</span> <input type="password" name="password" id='password' onChange={(event) => this.setState({ loginPassword: event.target.value })}></input></label>
                    
                    </form >
                    {acc }
                    <span className="error">{this.state.error}</span>
                </div>
            </div>
        )


    }

}

export { WLogin };
