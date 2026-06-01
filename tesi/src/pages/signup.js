import { createUserWithEmailAndPassword } from "firebase/auth";
import { addUser, auth, fb_app } from "../firebase.mjs";

import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/signup.css";
import { AccessLayout } from "./accessLayout";
import { isEmail } from "../utils/utils.js";

function Signup() {
  const [username, setUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState("");
  const [logged, setLogged] = useState(false);

  const fields = [
    {
      name: "Username",
      id: "username",
      onChange: (e) => setUsername(e.target.value),
    },
    {
      name: "Email",
      id: "email",
      type: "email",
      onChange: (e) => setRegisterEmail(e.target.value),
    },
    {
      name: "Password",
      id: "password",
      type: "password",
      onChange: (e) => setRegisterPassword(e.target.value),
    },
  ];

  const register = async (event) => {
    if (!username.trim()) {
      setError("Non hai inserito un username");
      event.preventDefault();
      return;
    }
    if (
      !isEmail(registerEmail) ||
      registerPassword.length < 6
    ) {
      event.preventDefault();
      setError(
        "Assicurati di aver inserito un'email corretta e una password di almeno 6 caratteri",
      );
      return;
    }

    createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
      .then(() => {
        const json = { username, loginEmail: registerEmail };
        setLogged(true);
        setError("Complimenti, sei entrato nel mondo di Carontech!");
        localStorage.setItem("normalEmail", JSON.stringify(json));
        dispatchEvent(new Event("nlogin"));
        addUser(fb_app, registerEmail, username);
      })
      .catch((errore) => {
        event.preventDefault();
        setError("Hai gia' usato questa email");
        return;
      });
  };

  let signupButton;
  if (logged)
    signupButton = (
      <label className="fields">
        {" "}
        <Link to="/">Accedi</Link>
      </label>
    );
  else
    signupButton = (
      <button onClick={(event) => register(event)}> Registrati</button>
    );
  return (
    <AccessLayout fields={fields} button={signupButton}>
      <span className="error">{error}</span>
    </AccessLayout>
  );
}

export { Signup };
