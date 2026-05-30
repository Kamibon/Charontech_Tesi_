import React, { useState, useEffect } from "react";

import logo from "../openai-logomark.png";
import "../css/home.css";
import { Link, useNavigate } from "react-router-dom";
import { Guida } from "../components/Guida.js";
import { Comment } from "../components/Comment.js";
import { logout } from "../firebase.mjs";
function Home() {
  const [query, setQuery] = useState("");
  const [sentenceToExplain, setSentenceToExplain] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState("none");
  const [guide, setGuide] = useState([]);
  const [block, setBlock] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [dati_guida, setDatiGuida] = useState("");
  const [spiegazione, setSpiegazione] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [showsComments, setShowsComments] = useState(false);
  const [commenti, setCommenti] = useState([]);
  const [currentComment, setCurrentComment] = useState("");
  const [liked, setLiked] = useState(false);

  const navigate = useNavigate()

  const menuItems = [
    { name: "Registrati", link: "/signup" },
    { name: "Iscrizione scrittori", link: "/writers" },
    { name: "Accedi", link: "/login" },
    { name: "Accesso scrittori", link: "/wlogin" },
  ];

  useEffect(() => {
    function waitForEmail() {
      retrieveData();
      setCurrentTitle("");
    }

    window.addEventListener("login", waitForEmail);
    window.addEventListener("nlogin", () => setSpiegazione(""));
    return () => {
      window.removeEventListener("login", waitForEmail);
      window.removeEventListener("nlogin", () => setSpiegazione(""));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addComment() {
    setShowsComments(true);
    setClicked(false);
    let user;
    if (localStorage.getItem("normalEmail") != null)
      user = JSON.parse(localStorage.getItem("normalEmail")).username;
    else
      user =
        JSON.parse(localStorage.getItem("Dati")).Nome +
        JSON.parse(localStorage.getItem("Dati")).Cognome;

    const com = {
      testo: currentComment,
      titolo: currentTitle,
      autore: dati_guida,
      user: user,
    };

    fetch("http://localhost:4200/api/moderate/" + currentComment)
      .then((response) => response.json())
      .then((json) => {
        if (json.ris === false) {
          setData("Il tuo commento e' inappropriato e non verra' pubblicato!");
          setShowsComments(false);
          setClicked(false);
        } else {
          fetch("http://localhost:4200/api/guides/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(com),
          });
          showComments();
        }
      });
  }

  function addLike() {
    if (localStorage.getItem("normalEmail") == null) return;

    const json = {
      titolo: currentTitle,
      autore: dati_guida,
      user: JSON.parse(localStorage.getItem("normalEmail")).username,
    };

    fetch("http://localhost:4200/api/guides/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    });

    setLiked("Piaciuto");
  }

  function addGuide() {
    const json = { titolo: query, testo: data, autore: "GPT" };
    fetch("http://localhost:4200/api/guides/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    }).then(() => {});
    setData(
      "Abbiamo aggiunto questa guida al nostro database, grazie per il tuo contributo!",
    );
    setLoading("none");
  }

  function addSuggestions() {
    let us;
    if (localStorage.getItem("Dati") !== null)
      us =
        JSON.parse(localStorage.getItem("Dati")).Nome +
        JSON.parse(localStorage.getItem("Dati")).Cognome;
    else us = JSON.parse(localStorage.getItem("normalEmail")).username;

    const json = { auth: dati_guida, sub: spiegazione, text: sentenceToExplain, user: us };

    fetch("http://localhost:4200/api/writers/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    });
  }

  function getApi() {
    setLoading(true);
    setClicked(false);
    setCommenti([]);
    setShowsComments(false);
    setData("");
    setSpiegazione("");
    setGuide([]);
    if (!query.startsWith("Come fare a")) {
      setData(
        "La tua ricerca non ha prodotto risultati. Verifica di aver inserito 'Come fare a' come prime parole ",
      );
      setLoading(false);
      return;
    }

    fetch("http://localhost:4200/api/moderate/" + query)
      .then((response) => response.json())
      .then((json) => {
        if (json.ris === false) {
          setData(
            "La tua richiesta viola determinati parametri. Non e' stato possibile rispondere",
          );
          setLoading(false);
          setBlock(true);
          getApi2();
        } else getApi2();
      });
  }

  function getApi2() {
    if (!block)
      fetch("http://localhost:4200/api/find/" + query)
        .then((response) => response.json())
        .then((json) => {
          setGuide(json.message);
          setLoading("done");
        });
    setBlock(false);
  }

  function getExplanation() {
    setLoading(true);
    const json = { text: "'" + data + "'", piece: "'" + sentenceToExplain + "'" };

    fetch("http://localhost:4200/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    })
      .then((response) => response.json())
      .then((json) => {
        setSpiegazione(json.message.content);
        setLoading("done");
      });
  }

  function callGPT() {
    fetch("http://localhost:4200/api/" + query)
      .then((response) => response.json())
      .then((json) => {
        setData(json.message.content);
        setLoading("done");
      });
  }

  function gptAnswer() {
    setGuide([]);
    setLoading(true);
    setData(
      "Stiamo sottoponendo la tua domanda a GPT, attendi qualche secondo...",
    );
    callGPT();
  }

  function log_out() {
    logout();
    localStorage.removeItem("Dati");
    localStorage.removeItem("Email");
    localStorage.removeItem("normalEmail");
    setQuery("");
    setGuide([]);
    setClicked(false);
    setShowsComments(false);
    setLoading(false);
  }

  function removeLike() {
    fetch(
      "http://localhost:4200/api/guides/like/remove/" +
        JSON.parse(localStorage.getItem("normalEmail")).username +
        "&" +
        dati_guida +
        "&" +
        currentTitle,
    ).then(() => setLiked("Mi piace"));
  }

  function reqGuide() {
    setData(
      "Abbiamo preso in carico la tua richiesta. Controlla nei prossimi giorni perche' qualcuno potrebbe aver scritto una guida a riguardo",
    );
    setLoading(false);
    fetch("http://localhost:4200/api/requests/" + query);
  }

  function showComments() {
    fetch(
      "http://localhost:4200/api/guides/comment/get/" +
        dati_guida +
        "&" +
        currentTitle,
    )
      .then((response) => response.json())
      .then((json) => {
        setCommenti(json.message);
        setClicked(false);
        setShowsComments(true);
      });
  }

  function showGuide(event) {
    setClicked(true);
    setDatiGuida(event.currentTarget.dataset.autore);
    setCurrentTitle(event.currentTarget.dataset.titolo);
    setLiked(event.currentTarget.dataset.liked);
    setData(
      event.currentTarget.dataset.titolo +
        ":" +
        event.currentTarget.dataset.testo,
    );
    setLoading("none");
    setGuide([]);
  }

  function retrieveData() {
    const loginEmail = JSON.parse(localStorage.getItem("Email")).loginEmail;
    fetch("http://localhost:4200/api/writers/data/" + loginEmail)
      .then((response) => response.json())
      .then((json) =>
        localStorage.setItem("Dati", JSON.stringify(json.message[0])),
      );
  }

  let dati;
  let element;
  let interactionPopup;
  let like;
  let comm;

  if (
    localStorage.getItem("normalEmail") !== null ||
    localStorage.getItem("Dati") !== null
  ) {
    comm = (
      <div id="com_inv">
        <textarea
          id="commentArea"
          placeholder="Inserisci qui il tuo commento"
          onChange={(event) => setCurrentComment(event.target.value)}
        />
        <button onClick={() => addComment()}>Invia</button>
      </div>
    );
    if (localStorage.getItem("Dati") == null) {
      if (liked === "Piaciuto")
        like = (
          <input
            type="button"
            value={liked}
            onClick={() => removeLike()}
          ></input>
        );
      else
        like = (
          <input type="button" value={liked} onClick={() => addLike()}></input>
        );
    }
  }

  let dom;
  if (dati_guida !== "GPT")
    dom = (
      <>
        <span>
          Vuoi suggerire all'autore di cambiare la parte di testo evidenziata
          con quella che hai trovato tu?
        </span>{" "}
        <br />
        <input
          type="button"
          value="Si"
          onClick={() => addSuggestions()}
        ></input>
      </>
    );

  if (clicked) {
    dati = (
      <aside id="guida_dati">
        <div
          id="ind"
          onClick={() => {
            getApi();
            setClicked(false);
          }}
        >
          Indietro
        </div>
        <pre>
          <span>Autore: {dati_guida}</span>
        </pre>
        {like}
        <input
          type="button"
          value="Visualizza i commenti"
          onClick={(event) => showComments(event)}
        ></input>{" "}
        <br />
        <textarea
          id="expArea"
          placeholder="Inserisci qui una parte di testo che non hai compreso"
          onChange={(event) => setSentenceToExplain(event.target.value)}
        ></textarea>
        <br />
        <input
          type="button"
          value="Invia"
          onClick={() => getExplanation()}
        ></input>
        <br />
        <textarea
          id="explanation"
          value={spiegazione}
          readOnly
          placeholder="Qui verra' visualizzata la spiegazione"
        />
        <br />
        {dom}
      </aside>
    );
  } else if (!clicked && showsComments) {
    dati = (
      <aside id="guida_dati">
        <div
          id="ind"
          onClick={() => {
            setClicked(true);
            setShowsComments(false);
          }}
        >
          Indietro
        </div>
        <br />
        <div id="com_section">
          {commenti.map((com, index) => (
            <Comment key={index} user={com.user} testo={com.testo} />
          ))}
        </div>
        {comm}
      </aside>
    );
  }

  let menu;
  if (localStorage.getItem("Email") == null)
    menu = (
      <aside id="menu">
        {menuItems.map((item, index) => (
          <div onClick={() => navigate(item.link)} className="sec" key={index}>
            <Link className="text-xs sm:text-base" to={item.link}>
              {item.name}
            </Link>
          </div>
        ))}
      </aside>
    );
  else if (localStorage.getItem("Dati") !== null)
    menu = (
      <aside id="menu">
        <div className="sec">
          <Link to="/login">Accedi</Link>
        </div>
        <div className="sec">
          <Link to="/wlogin">Accesso scrittori</Link>
        </div>
      </aside>
    );
  else if (localStorage.getItem("Dati") !== null)
    menu = (
      <aside id="menu">
        <div className="sec">
          <Link to="/" onClick={() => log_out()}>
            Logout
          </Link>
        </div>
        <div className="sec">
          <Link to="/personal"> Area personale</Link>
        </div>
      </aside>
    );

  if (localStorage.getItem("normalEmail") != null)
    menu = (
      <aside id="menu">
        <div className="sec">
          <Link to="/" onClick={() => log_out()}>
            Logout
          </Link>
        </div>
      </aside>
    );

  if (loading === true)
    element = (
      <img alt="" src={logo} id="logo" style={{ display: loading }}></img>
    );
  else if (loading === "done" && guide?.length !== 0) {
    interactionPopup = (
      <div id="int">
        {" "}
        <span>Hai trovato cio' che ti interessa?</span>
        <button onClick={() => gptAnswer()}>No</button>
      </div>
    );
  } else if (loading === "done" && guide.length === 0 && !clicked) {
    interactionPopup = (
      <div id="int">
        <span>Questa risposta ti soddifa?</span>
        <button onClick={() => addGuide()}>Si</button>
        <button onClick={() => reqGuide()}>No</button>
      </div>
    );
  }

  return (
    <div className="homepage flex flex-col h-screen">
      <nav id="navhome">
        <span className="text-base text-red-600 hidden sm:inline">
          {" "}
          Carontech
        </span>

        <input
          className="px-2 rounded-lg"
          id="bar"
          placeholder="Come fare a...?"
          onChange={(event) => setQuery(event.target.value)}
        />
        <label htmlFor="bar" />

        <label>
          {" "}
          <button onClick={() => getApi()}>🔍</button>
        </label>
      </nav>
      <section className="text flex">
        {menu}
        {dati}
        <div id="spazio_guide">
          {guide.map((guida, index) => (
            <Guida
              key={index}
              autore={guida.autore}
              titolo={guida.titolo}
              testo={guida.testo}
              onClick={(event) => showGuide(event)}
            />
          ))}
        </div>
        <span className="response"> {data}</span>
      </section>
      {element}
      {interactionPopup}

      <footer className="flex grow bg-red-700 items-center justify-center">
        {" "}
        <Link to="/chi">Chi siamo</Link>
      </footer>
    </div>
  );
}

export { Home };
