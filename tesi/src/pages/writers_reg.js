import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "../components/input";
import "../css/signup.css";
import { auth } from "../firebase.mjs";
import { AccessLayout } from "./accessLayout";

function Writersreg() {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState("");
  const [logged, setLogged] = useState("");

  const fields = [
    {
      name: "Nome",
      id: "Nome",
      onChange: (e) => setNome(e.target.value),
    },
    {
      name: "Cognome",
      id: "Cognome",
      onChange: (e) => setCognome(e.target.value),
    },
    {
      name: "Descrizione",
      id: "Descrizione",
      onChange: (e) => setDescrizione(e.target.value),
    },
    {
      name: "Email",
      id: "email",
      type: "email",
      onChange: (e) => setLoginEmail(e.target.value),
    },
    {
      name: "Password",
      id: "password",
      type: "password",
      onChange: (e) => setRegisterPassword(e.target.value),
    },
  ];

  function send_data() {
    const json = { nome, cognome, descrizione, loginEmail };
    const email = { loginEmail };
    fetch("http://localhost:4200/api/writers/reg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    });
    localStorage.setItem("Email", JSON.stringify(email));
    dispatchEvent(new Event("login"));
  }

  function check(event) {
    if (nome === "" || cognome === "" || descrizione === "") {
      event.preventDefault();
      setError("Inserisci tutti i dati");
      return;
    }
    if (
      !/^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        String(loginEmail).toLowerCase(),
      ) ||
      registerPassword.length < 6
    ) {
      event.preventDefault();
      setError(
        "Hai sbagliato ad inserire email o hai inserito una password con meno di 6 caratteri",
      );
      return;
    }
    createUserWithEmailAndPassword(auth, loginEmail, registerPassword)
      .then((cred) => sendEmailVerification(cred.user))
      .then(() => {
        setLogged(true);
        setError("Complimenti, sei entrato nel mondo di Carontech!");
      })
      .catch((errore) => {
        console.log(errore);
        event.preventDefault();
        setError("Hai gia' usato questa email");
        return;
      });
    send_data();
  }

  let button;
  if (logged) button = <Link to="/">Accedi</Link>;
  else
    button = (
      <button onClick={(event) => check(event)}>
        Iscriviti come scrittore
      </button>
    );

  return (
    <AccessLayout fields={fields} button={button}>
      <span className="error">{error}</span>
    </AccessLayout>
  );
}

export { Writersreg };
