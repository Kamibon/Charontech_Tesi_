import {  signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth, fb_app, getUser } from "./firebase.mjs";
import React from "react";
import "./css/signup.css";
import { Link } from "react-router-dom";


class Login extends React.Component {

    
    constructor(props) {
        super(props);
        this.state = {
            username:'',
            loginEmail: '',
            loginPassword: '',
            error: ''
        };
    }

    
    

    login = async (event) => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(this.state.loginEmail).toLowerCase()) || this.state.loginPassword.length < 6) {
            event.preventDefault();
            this.setState({ error: "Assicurati di aver inserito un'email corretta e una password di almeno 6 caratteri" })
            return;
        }
        
        try {
           await signInWithEmailAndPassword(auth, this.state.loginEmail, this.state.loginPassword);
           
        }
        catch (error) {
            //console.log(error)
             event.preventDefault();
            this.setState({ error: "Assicurati di aver inserito un'email corretta e una password di almeno 6 caratteri" })
            return;
        }
        
        getUser(fb_app, this.state.loginEmail).then((res) => {
            const json = {
                username: res,
                loginEmail: this.state.loginEmail
            }
            localStorage.setItem("normalEmail", JSON.stringify(json));
           
            dispatchEvent(new Event("nlogin")); });
        
    }


    logout = async () => {
       
        signOut(auth);

    }

    
    

    render() {
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
                    <label className="fields"> <Link to="/" onClick={this.login}>Accedi</Link></label>
                </form >
                    <span className="error">{this.state.error}</span>
                </div>
            </div>
        )


    }

}

export { Login };
