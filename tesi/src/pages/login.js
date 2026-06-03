import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useState } from "react";
import { isEmail } from "../utils/utils.js";
import "../css/signup.css";
import { auth, fb_app, getUser } from "../firebase.mjs";
import { AccessLayout } from "./accessLayout";

function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");

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
      console.log(error);
      setError(
        "Assicurati di aver inserito un'email corretta e una password di almeno 6 caratteri",
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

    getUser(fb_app, loginEmail).then((res) => {
      const json = { username: res, loginEmail };
      localStorage.setItem("normalEmail", JSON.stringify(json));
      dispatchEvent(new Event("nlogin"));
    });
  };

  const logoutFn = async () => {
    signOut(auth);
  };

  return (
    <AccessLayout
      fields={fields}
      button={<button onClick={login}>Accedi</button>}
    >
      <span className="error">{error}</span>
    </AccessLayout>
  );
}

export { Login };
