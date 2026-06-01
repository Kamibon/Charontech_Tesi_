import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/signup.css";
import { auth } from "../firebase.mjs";
import { AccessLayout } from "./accessLayout";
import { isEmail } from "../utils/utils.js";

function Writersreg() {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState("");
  const [logged, setLogged] = useState("");

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:4200/api";

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
    fetch(`${apiUrl}/writers/reg`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    });
    localStorage.setItem("Email", JSON.stringify(email));
    dispatchEvent(new Event("login"));
  }

  function check(event) {
    if (!nome.trim() || !cognome.trim() || !descrizione.trim()) {
      event.preventDefault();
      setError("Inserisci tutti i dati");
      return;
    }
    if (
      !isEmail(loginEmail) ||
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
