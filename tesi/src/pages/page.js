import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { Comment } from "../components/Comment.js";
import { Guide } from "../components/Guida.js";
import "../css/home.css";
import { logout } from "../firebase.mjs";
import logo from "../openai-logomark.png";

function Home() {
  const [query, setQuery] = useState("");
  const [sentenceToExplain, setSentenceToExplain] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [guideData, setGuideData] = useState("");
  const [explanation, setExplanation] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [showsComments, setShowsComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [currentComment, setCurrentComment] = useState("");
  const [liked, setLiked] = useState(false);

  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:4200/api";

  const menuItems = [
    { name: "Registrati", link: "/signup" },
    { name: "Iscrizione scrittori", link: "/writers" },
    { name: "Accedi", link: "/login" },
    { name: "Accesso scrittori", link: "/wlogin" },
  ];

  useEffect(() => {
    const handleLogin = () => {
      retrieveData();
      setCurrentTitle("");
    };

    const handleNLogin = () => setExplanation("");

    window.addEventListener("login", handleLogin);
    window.addEventListener("nlogin", handleNLogin);

    return () => {
      window.removeEventListener("login", handleLogin);
      window.removeEventListener("nlogin", handleNLogin);
    };
  }, []);

  const normalEmail = localStorage.getItem("normalEmail");
  const writerData = localStorage.getItem("Dati");
  const isLogged = !!localStorage.getItem("Email");

  const getUserName = () => {
    if (normalEmail) return JSON.parse(normalEmail).username;
    if (writerData) {
      const writer = JSON.parse(writerData);
      return `${writer.Nome}${writer.Cognome}`;
    }
    return "";
  };

  const getApi2 = (skipFetch) => {
    if (skipFetch) {
      setLoading(false);
      return;
    }

    fetch(`${apiUrl}/find/${query}`)
      .then((response) => response.json())
      .then((json) => setGuide(json.message))
      .finally(() => setLoading(false));
  };

  const addComment = () => {
    setShowsComments(true);
    setClicked(false);

    const user = getUserName();
    const payload = {
      testo: currentComment,
      titolo: currentTitle,
      autore: guideData,
      user,
    };

    fetch(`${apiUrl}/moderate/${currentComment}`)
      .then((response) => response.json())
      .then((json) => {
        if (json.ris === false) {
          setData("Il tuo commento e' inappropriato e non verra' pubblicato!");
          setShowsComments(false);
          setClicked(false);
          return;
        }

        fetch(`${apiUrl}/guides/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).then(() => showComments());
      });
  };

  const addLike = () => {
    if (!normalEmail) return;

    const json = {
      titolo: currentTitle,
      autore: guideData,
      user: JSON.parse(normalEmail).username,
    };

    fetch(`${apiUrl}/guides/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    });

    setLiked("Piaciuto");
  };

  const addGuide = () => {
    const json = { titolo: query, testo: data, autore: "GPT" };
    fetch(`${apiUrl}/guides/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    });

    setData(
      "Abbiamo aggiunto questa guida al nostro database, grazie per il tuo contributo!",
    );
    setLoading(false);
  };

  const addSuggestions = () => {
    const json = {
      auth: guideData,
      sub: explanation,
      text: sentenceToExplain,
      user: getUserName(),
    };

    fetch(`${apiUrl}/writers/suggestions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    });
  };

  const getApi = () => {
    setLoading(true);
    setClicked(false);
    setComments([]);
    setShowsComments(false);
    setData("");
    setExplanation("");
    setGuide([]);

    if (!query.startsWith("Come fare a")) {
      setData(
        "La tua ricerca non ha prodotto risultati. Verifica di aver inserito 'Come fare a' come prime parole ",
      );
      setLoading(false);
      return;
    }

    fetch(`${apiUrl}/moderate/${query}`)
      .then((response) => response.json())
      .then((json) => {
        if (!json.ris) {
          setData(
            "La tua richiesta viola determinati parametri. Non e' stato possibile rispondere",
          );
          getApi2(true);
          return;
        }

        getApi2(false);
      })
      .catch(() => setLoading(false));
  };

  const getExplanation = () => {
    setLoading(true);
    const json = {
      text: `'${data}'`,
      piece: `'${sentenceToExplain}'`,
    };

    fetch(`${apiUrl}/explain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    })
      .then((response) => response.json())
      .then((json) => setExplanation(json.message.content))
      .finally(() => setLoading(false));
  };

  const callGPT = () => {
    fetch(`${apiUrl}/${query}`)
      .then((response) => response.json())
      .then((json) => setData(json.message.content))
      .finally(() => setLoading(false));
  };

  const gptAnswer = () => {
    setGuide([]);
    setLoading(true);
    setData(
      "Stiamo sottoponendo la tua domanda a GPT, attendi qualche secondo...",
    );
    callGPT();
  };

  const log_out = () => {
    logout();
    localStorage.removeItem("Dati");
    localStorage.removeItem("Email");
    localStorage.removeItem("normalEmail");
    setQuery("");
    setGuide([]);
    setClicked(false);
    setShowsComments(false);
    setLoading(false);
  };

  const removeLike = () => {
    if (!normalEmail) return;

    fetch(
      `${apiUrl}/guides/like/remove/${JSON.parse(normalEmail).username}&${guideData}&${currentTitle}`,
    ).then(() => setLiked("Mi piace"));
  };

  const reqGuide = () => {
    setData(
      "Abbiamo preso in carico la tua richiesta. Controlla nei prossimi giorni perche' qualcuno potrebbe aver scritto una guida a riguardo",
    );
    setLoading(false);
    fetch(`${apiUrl}/requests/${query}`);
  };

  const showComments = () => {
    fetch(`${apiUrl}/guides/comment/${guideData}&${currentTitle}`)
      .then((response) => response.json())
      .then((json) => {
        setComments(json.message);
        setClicked(false);
        setShowsComments(true);
      });
  };

  const showGuide = (event) => {
    setClicked(true);
    setGuideData(event.currentTarget.dataset.autore);
    setCurrentTitle(event.currentTarget.dataset.titolo);
    setLiked(event.currentTarget.dataset.liked);
    setData(
      `${event.currentTarget.dataset.titolo}:${event.currentTarget.dataset.testo}`,
    );
    setLoading(false);
    setGuide([]);
  };

  const retrieveData = () => {
    const loginEmail = JSON.parse(localStorage.getItem("Email")).loginEmail;

    fetch(`${apiUrl}/writers/data/${loginEmail}`)
      .then((response) => response.json())
      .then((json) =>
        localStorage.setItem("Dati", JSON.stringify(json.message[0])),
      );
  };

  const isNormalUser = !!normalEmail;
  const isWriter = !!writerData;

  const commentSection = (isNormalUser || isWriter) && (
    <div id="com_inv">
      <textarea
        id="commentArea"
        placeholder="Inserisci qui il tuo commento"
        onChange={(event) => setCurrentComment(event.target.value)}
      />
      <button disabled={!currentComment.trim()} onClick={addComment}>
        Invia
      </button>
    </div>
  );

  const likeButton = isNormalUser && (
    <input
      type="button"
      value={liked === "Piaciuto" ? liked : "Mi piace"}
      onClick={liked === "Piaciuto" ? removeLike : addLike}
    />
  );

  const suggestionBlock = guideData !== "GPT" && (
    <>
      <span>
        Vuoi suggerire all'autore di cambiare la parte di testo evidenziata con
        quella che hai trovato tu?
      </span>
      <input
        className="disabled:opacity-70"
        disabled={!explanation.trim()}
        type="button"
        value="Si"
        onClick={addSuggestions}
      />
    </>
  );

  const asideContent = clicked ? (
    <aside
      className="flex flex-col gap-2 px-3 py-2 border-dashed border-2 border-gray-400 rounded-lg"
      id="guida_dati"
    >
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
        <span>Autore: {guideData}</span>
      </pre>
      {likeButton}
      <input
        className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg cursor-pointer"
        type="button"
        value="Visualizza i commenti"
        onClick={showComments}
      />
      <textarea
        id="expArea"
        className="w-full h-[30%] px-2 py-1 rounded-lg text-sm"
        placeholder="Inserisci qui una parte di testo che non hai compreso"
        onChange={(event) => setSentenceToExplain(event.target.value)}
      />
      <input
        className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg cursor-pointer disabled:opacity-70"
        type="button"
        value="Invia"
        onClick={getExplanation}
        disabled={!sentenceToExplain.trim()}
      />
      <textarea
        id="explanation"
        className="w-full bg-gray-200 h-[30%] px-2 py-1 rounded-lg text-sm"
        value={explanation}
        disabled
        readOnly
        placeholder="Qui verra' visualizzata la spiegazione"
      />
      {suggestionBlock}
    </aside>
  ) : showsComments ? (
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
      <div id="com_section">
        {comments.map((com, index) => (
          <Comment key={index} user={com.user} text={com.testo} />
        ))}
      </div>
      {commentSection}
    </aside>
  ) : null;

  let menu;
  if (!isLogged) {
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
  } else if (isWriter) {
    menu = (
      <aside id="menu">
        <div className="sec">
          <Link to="/" onClick={log_out}>
            Logout
          </Link>
        </div>
        <div className="sec">
          <Link to="/personal"> Area personale</Link>
        </div>
      </aside>
    );
  } else if (isNormalUser) {
    menu = (
      <aside id="menu">
        <div className="sec">
          <Link to="/" onClick={log_out}>
            Logout
          </Link>
        </div>
      </aside>
    );
  }

  const loadingLogo = loading ? (
    <img
      alt="Loading answers..."
      className="w-full h-[70%]"
      src={logo}
      id="logo"
      style={{ display: loading ? "block" : "none" }}
    />
  ) : null;

  let interactionPopup = null;
  if (!loading && guide.length !== 0) {
    interactionPopup = (
      <div id="int">
        <span>Hai trovato cio' che ti interessa?</span>
        <button onClick={gptAnswer}>No</button>
      </div>
    );
  }

  if (!loading && guide.length === 0 && !clicked && data) {
    interactionPopup = (
      <div id="interactionPopup" className="flex flex-col gap-2 items-center">
        <span className="text-lg font-bold">Questa risposta ti soddifa?</span>
        <div className="flex gap-3">
          <button onClick={addGuide}>Si</button>
          <button onClick={reqGuide}>No</button>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage flex flex-col h-screen">
      <nav id="navhome">
        <span className="text-base text-red-600 hidden sm:inline">
          Carontech
        </span>

        <input
          className="px-2 rounded-lg"
          id="bar"
          placeholder="Come fare a...?"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") getApi();
          }}
        />
        <label htmlFor="bar" />

        <label>
          <button onClick={getApi}>🔍</button>
        </label>
      </nav>
      <section className="text flex">
        {menu}
        {asideContent}
        <div
          id="spazio_guide"
          className=" grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 py-3 px-2"
        >
          {guide.map((guida, index) => (
            <Guide
              key={index}
              author={guida.autore}
              title={guida.titolo}
              text={guida.testo}
              onClick={showGuide}
            />
          ))}
          <Guide
            author="Autore"
            title="Titolo"
            text="Testo"
            onClick={showGuide}
          />
        </div>
        {loadingLogo}
        <span className="response"> {data}</span>
      </section>

      {interactionPopup}

      <footer className="flex grow bg-red-700 items-center justify-center">
        <Link to="/chi">Chi siamo</Link>
      </footer>
    </div>
  );
}

export { Home };
