import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import "../css/personal.css";
import { Guida } from "../components/Guida.js";
import { Request } from "../components/request.js";
import { Advice } from "../components/advice.js";
import { logout, auth, changeEmail } from "../firebase.mjs";

function Personal() {
  const [richieste, setRichieste] = useState([]);
  const [suggerimenti, setSuggerimenti] = useState([]);
  const [aux1, setAux1] = useState([]);
  const [aux2, setAux2] = useState([]);
  const [aux3, setAux3] = useState([]);
  const [guide, setGuide] = useState([]);
  const [guideOn, setGuideOn] = useState(false);
  const [dataOn, setDataOn] = useState(false);
  const [nome, setNome] = useState("Titolo della tua guida");
  const [writing, setWriting] = useState(false);
  const [titolo, setTitolo] = useState("");
  const [testo, setTesto] = useState("");
  const [changingData, setChangingData] = useState(false);
  const [changeGuide, setChangeGuide] = useState(false);
  const [message, setMessage] = useState("");
  const [dataToChange, setDataToChange] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [actualText, setActualText] = useState("");
  const [updated, setUpdated] = useState(false);
 
  useEffect(() => {
    fillAux1();
    fillAux2();
    fillAux3();

    function onRemove() {
      fillAux2();
      showRequests();
    }
    window.addEventListener("remove", onRemove);
    return () => window.removeEventListener("remove", onRemove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (aux3.length !== guide.length && guideOn === true) setGuide(aux3);
    if (updated === true) {
      setGuide(aux3);
      setUpdated(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aux3, guideOn, updated]);

  function addGuide() {
    const guida = {
      titolo: titolo || nome,
      testo: testo,
      autore: JSON.parse(localStorage.getItem("Dati")).Nome + JSON.parse(localStorage.getItem("Dati")).Cognome,
    };

    fetch("http://localhost:4200/api/moderate/" + titolo + testo)
      .then((response) => response.json())
      .then((json) => {
        if (json.ris === false) {
          setMessage("Il tuo testo contiene contenuto non conforme al nostro regolamento e non verra' caricato");
        } else {
          fetch("http://localhost:4200/api/guides/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(guida),
          });
          fillAux3();
          showGuides();
        }
      });
  }

  function fillAux1() {
    let des = JSON.parse(localStorage.getItem("Dati")).Descrizione;
    fetch("http://localhost:4200/api/requests/get/" + des)
      .then((response) => response.json())
      .then((json) => setAux1(json.message));
  }

  function fillAux2() {
    fetch(
      "http://localhost:4200/api/writers/suggestions/" +
        JSON.parse(localStorage.getItem("Dati")).Nome +
        JSON.parse(localStorage.getItem("Dati")).Cognome,
    )
      .then((response) => response.json())
      .then((json) => setAux2(json.message));
  }

  function fillAux3() {
    fetch(
      "http://localhost:4200/api/writers/guides/" +
        JSON.parse(localStorage.getItem("Dati")).Nome +
        JSON.parse(localStorage.getItem("Dati")).Cognome,
    )
      .then((response) => response.json())
      .then((json) => setAux3(json.message));
  }

  function fill_Guides() {
    fetch(
      "http://localhost:4200/api/writers/guides/" +
        JSON.parse(localStorage.getItem("Dati")).Nome +
        JSON.parse(localStorage.getItem("Dati")).Cognome,
    )
      .then((response) => response.json())
      .then((json) => {
        setGuide(json.message);
        console.log(json.message);
      });
  }

  function log_out() {
    logout();
    localStorage.removeItem("Dati");
    localStorage.removeItem("Email");
  }

  function retrieveData() {
    const loginEmail = JSON.parse(localStorage.getItem("Email")).loginEmail;
    fetch("http://localhost:4200/api/writers/data/" + loginEmail)
      .then((response) => response.json())
      .then((json) => localStorage.setItem("Dati", JSON.stringify(json.message[0])));
  }

  function showData() {
    setGuide([]);
    setChangingData(false);
    setRichieste([]);
    setSuggerimenti([]);
    setGuideOn(false);
    setWriting(false);
    setDataOn(true);
    setMessage("");
    setTesto("");
    setActualText("");
    setChangeGuide(false);
  }

  function showGuides() {
    setSuggerimenti([]);
    setRichieste([]);
    setChangingData(false);
    setGuide(aux3);
    setGuideOn(true);
    setWriting(false);
    setDataOn(false);
    setMessage("");
    setTesto("");
    setActualText("");
    setChangeGuide(false);
  }

  function showRequests() {
    setGuide([]);
    setChangingData(false);
    setSuggerimenti([]);
    setRichieste(aux1);
    setGuideOn(false);
    setWriting(false);
    setDataOn(false);
    setMessage("");
    setTesto("");
    setActualText("");
    setChangeGuide(false);
  }

  function showSuggestions() {
    setGuide([]);
    setRichieste([]);
    setSuggerimenti(aux2);
    setGuideOn(false);
    setWriting(false);
    setDataOn(false);
    setMessage("");
    setTesto("");
    setActualText("");
    setChangeGuide(false);
  }

  function updateData(campo, valore) {
    if (!valore.trim()) {
      setMessage("Non puoi modificare con un campo vuoto");
      return;
    }

    const json = {
      loginEmail: JSON.parse(localStorage.getItem("Dati")).loginEmail,
      campo: campo,
      valore: valore,
    };

    const email = { loginEmail: valore };

    if (campo === "email") {
      changeEmail(auth.currentUser, valore);
      localStorage.setItem("Email", JSON.stringify(email));
    }

    fetch("http://localhost:4200/api/writers/data/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    });

    setMessage("Vedrai aggiornati i tuoi dati al prossimo ingresso sul tuo profilo");
    setChangingData(false);
  }

  function updateGuide() {
    const json = {
      autore: JSON.parse(localStorage.getItem("Dati")).Nome + JSON.parse(localStorage.getItem("Dati")).Cognome,
      testo: testo,
      titolo: nome,
    };

    fetch("http://localhost:4200/api/guides/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    }).then(() => {
      setMessage("Vedrai aggiornata la tua guida al tuo prossimo ingresso");
      setWriting(false);
      setGuide([]);
      fillAux3();
    });
  }

  function writeNew() {
    setGuide([]);
    setNome("");
    setRichieste([]);
    setSuggerimenti([]);
    setWriting(true);
    setGuideOn(false);
  }

  function writeNewWithTitle(event) {
    setGuide([]);
    setRichieste([]);
    setSuggerimenti([]);
    setNome(event.currentTarget.dataset.testo);
    setWriting(true);
    setGuideOn(false);
  }

  function writeUpdate(event) {
    setChangeGuide(true);
    setGuide([]);
    setRichieste([]);
    setSuggerimenti([]);
    setNome(event.currentTarget.dataset.titolo);
    setWriting(true);
    setActualText(event.currentTarget.dataset.testo);
    setGuideOn(false);
  }

  let button, data, write;

  if (changingData === true) {
    data = (
      <div id="dataValues">
        <input placeholder={"Nuova  " + dataToChange} onChange={(event) => setInputValue(event.target.value)} />
        <button onClick={() => updateData(dataToChange, inputValue)}>Invia</button>{" "}
      </div>
    );
  } else data = <span id="dataValues">{message}</span>;

  if (guideOn === true)
    button = (
      <button id="Scrivi" onClick={() => writeNew()}>
        {" "}
        Scrivi una nuova guida
      </button>
    );

  if (writing === true && changeGuide === false) {
    write = (
      <div className="writing">
        <label>
          {" "}
          <input id="titolo_guida" placeholder="Scrivi qui il titolo  della guida" defaultValue={nome} onChange={(event) => setTitolo(event.target.value)} />
        </label>
        <textarea id="testo_guida" placeholder="Scrivi qui la guida" onChange={(event) => setTesto(event.target.value)}></textarea>
      </div>
    );
    button = <button onClick={() => addGuide()}>Aggiungi guida </button>;
  } else if (writing === true && changeGuide === true) {
    write = (
      <div className="writing">
        <span> {nome} </span>
        <textarea id="testo_guida" defaultValue={actualText} onChange={(event) => setTesto(event.target.value)}></textarea>
      </div>
    );
    button = <button onClick={() => updateGuide()}>Aggiorna guida </button>;
  } else if (dataOn) {
    write = (
      <>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cognome</th>
              <th>
                Email {" "}
                <span onClick={() => { setDataToChange("email"); setChangingData(true); }}>Modifica</span>
              </th>
              <th>
                Descrizione {" "}
                <span onClick={() => { setDataToChange("Descrizione"); setChangingData(true); }}>Modifica</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{JSON.parse(localStorage.getItem("Dati")).Nome}</td>
              <td>{JSON.parse(localStorage.getItem("Dati")).Cognome}</td>
              <td>{JSON.parse(localStorage.getItem("Dati")).loginEmail}</td>
              <td>{JSON.parse(localStorage.getItem("Dati")).Descrizione}</td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }

  return (
    <div id="container">
      {write}
      {data}
      <nav>
        <div className="sec" onClick={() => showRequests()}>
          {" "}
          Richieste {" "}
          <span className="number"> {aux1.length}</span> {" "}
        </div>
        <div className="sec" onClick={() => showSuggestions()}>
          {" "}
          Suggerimenti {" "}
          <span className="number">{aux2.length}</span> {" "}
        </div>
        <div className="sec" onClick={() => showGuides()}>
          {" "}
          Guide scritte {" "}
        </div>
        <div className="sec" onClick={() => showData()}>
          {" "}
          Dati personali {" "}
        </div>

        <div className="sec">
          <Link to="/">Home</Link> {" "}
        </div>
        <div className="sec">
          <Link to="/" onClick={() => log_out()}>
            {" "}
            Logout
          </Link> {" "}
        </div>
      </nav>
      <div className="richieste">
        {richieste.map((ric, index) => (
          <Request key={index} testo={ric.payload.richiesta} onClick={(event) => writeNewWithTitle(event)} />
        ))}

        {suggerimenti.map((ric, index) => (
          <Advice key={index} testo={ric.text} sub={ric.sub} user={ric.user} />
        ))}
        {guide.map((ric, index) => (
          <Guida key={index} testo={ric.testo} titolo={ric.titolo} autore={ric.autore} onClick={(event) => writeUpdate(event)} />
        ))}

        {button}
      </div>

      <div></div>
    </div>
  );
}

export { Personal };
/* */
