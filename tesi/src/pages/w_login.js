import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/signup.css";
import { auth } from "../firebase.mjs";
import { AccessLayout } from "./accessLayout";
import { isEmail } from "../utils/utils.js";

function WLogin() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");
  
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:4200/api";
  const navigate = useNavigate();

  const fields = [
    {
      name: "Email",
      id: "email",
      onChange: (e) => setLoginEmail(e.target.value),
    },
    {
      name: "Password",
      id: "password",
      type: "password",
      onChange: (e) => setLoginPassword(e.target.value),
    },
  ];

  const login = async (event) => {
    if (
      !isEmail(loginEmail) ||
      loginPassword.length < 6
    ) {
      event.preventDefault();
      setError(
        "Assicurati di aver inserito un'email corretta e una password di almeno 6 caratteri",
      );
      return;
    }
    event.preventDefault();
    const response = await fetch(
      `${apiUrl}/writers/data/${loginEmail}`,
    );
    const { message } = await response.json();
    if (message.length === 0) {
      setError(
        "Questa email non e' presente nel nostro database. Assicurati di averla scritta correttamente",
      );
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (error) {
      event.preventDefault();
      setError(
        "Assicurati di aver inserito un'email corretta e una password di almeno 6 caratteri",
      );
      return;
    }

    navigate("/");
    localStorage.setItem("Email", JSON.stringify(loginEmail));
    dispatchEvent(new Event("login"));
  };

  const logoutFn = async () => {
    signOut(auth);
  };

  let loginButton;

  loginButton = (
    <button id="r_button" onClick={login}>
      Accedi
    </button>
  );

  return (
    <AccessLayout fields={fields} button={loginButton}>
      <span className="error">{error}</span>
    </AccessLayout>
  );
}

export { WLogin };
