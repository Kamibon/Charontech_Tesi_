import axios from "axios";
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { Advice } from "../components/advice.js";
import { Guide } from "../components/Guida.js";
import { Request } from "../components/request.js";
import "../css/personal.css";
import { auth, changeEmail, logout } from "../firebase.mjs";

function Personal() {
  const [requests, setRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [guides, setGuides] = useState([]);
  const [viewMode, setViewMode] = useState("");
  const [draftTitle, setDraftTitle] = useState("Titolo della tua guida");
  const [guideTitle, setGuideTitle] = useState("");
  const [guideText, setGuideText] = useState("");
  const [changingData, setChangingData] = useState(false);
  const [dataToChange, setDataToChange] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:4200/api";

  const getWriterData = () => JSON.parse(localStorage.getItem("Dati")) || {};
  const getWriterName = () => {
    const writer = getWriterData();
    return writer.Nome && writer.Cognome
      ? `${writer.Nome}${writer.Cognome}`
      : "";
  };

  const loadRequests = () => {
    const writer = getWriterData();
    if (!writer.Descrizione) return;

    axios
      .get(`${apiUrl}/requests/${writer.Descrizione}`)
      .then((response) => setRequests(response.data.message))
      .catch(() => {});
  };

  const loadSuggestions = () => {
    const writer = getWriterData();
    if (!writer.Nome || !writer.Cognome) return;

    axios
      .get(`${apiUrl}/writers/suggestions/${writer.Nome}${writer.Cognome}`)
      .then((response) => setSuggestions(response.data.message))
      .catch(() => {});
  };

  const loadGuides = () => {
    const writer = getWriterData();
    if (!writer.Nome || !writer.Cognome) return;

    axios
      .get(`${apiUrl}/writers/guides/${writer.Nome}${writer.Cognome}`)
      .then((response) => setGuides(response.data.message))
      .catch(() => {});
  };

  useEffect(() => {
    loadRequests();
    loadSuggestions();
    loadGuides();

    const handleRemove = () => {
      loadSuggestions();
      setViewMode("requests");
    };

    window.addEventListener("remove", handleRemove);
    return () => window.removeEventListener("remove", handleRemove);
  }, []);

  const resetView = () => {
    setMessage("");
    setChangingData(false);
    setInputValue("");
  };

  const showRequests = () => {
    resetView();
    setViewMode("requests");
  };

  const showSuggestions = () => {
    resetView();
    setViewMode("suggestions");
  };

  const showGuides = () => {
    resetView();
    setViewMode("guides");
  };

  const showData = () => {
    resetView();
    setViewMode("data");
  };

  const startNewGuide = () => {
    resetView();
    setDraftTitle("Titolo della tua guida");
    setGuideTitle("");
    setGuideText("");
    setViewMode("createGuide");
  };

  const startNewGuideWithTitle = (event) => {
    resetView();
    setDraftTitle(event.currentTarget.dataset.testo);
    setGuideTitle("");
    setGuideText("");
    setViewMode("createGuide");
  };

  const startEditGuide = (event) => {
    resetView();
    setDraftTitle(event.currentTarget.dataset.titolo);
    setGuideTitle("");
    setGuideText(event.currentTarget.dataset.testo);
    setViewMode("editGuide");
  };

  const addGuide = () => {
    const title = guideTitle.trim() || draftTitle;
    const writer = getWriterName();
    if (!writer) return;

    const payload = {
      titolo: title,
      testo: guideText,
      autore: writer,
    };

    axios
      .get(`${apiUrl}/moderate/${title}${guideText}`)
      .then((response) => {
        if (response.data.ris === false) {
          setMessage(
            "Il tuo testo contiene contenuto non conforme al nostro regolamento e non verra' caricato",
          );
          return null;
        }

        return axios.post(`${apiUrl}/guides/add`, payload);
      })
      .then(() => {
        loadGuides();
        showGuides();
      })
      .catch(() => {});
  };

  const updateGuide = () => {
    const writer = getWriterName();
    if (!writer) return;

    axios
      .post(`${apiUrl}/guides/update`, {
        autore: writer,
        testo: guideText,
        titolo: draftTitle,
      })
      .then(() => {
        setMessage("Vedrai aggiornata la tua guida al tuo prossimo ingresso");
        setGuideTitle("");
        setGuideText("");
        loadGuides();
        setViewMode("guides");
      })
      .catch(() => {});
  };

  const updateData = (campo, valore) => {
    if (!valore.trim()) {
      setMessage("Non puoi modificare con un campo vuoto");
      return;
    }

    const writer = getWriterData();
    if (!writer.loginEmail) return;

    if (campo === "email") {
      changeEmail(auth.currentUser, valore);
      localStorage.setItem("Email", JSON.stringify({ loginEmail: valore }));
    }

    axios.post(`${apiUrl}/writers/data/update`, {
      loginEmail: writer.loginEmail,
      campo,
      valore,
    });

    setMessage(
      "Vedrai aggiornati i tuoi dati al prossimo ingresso sul tuo profilo",
    );
    setChangingData(false);
  };

  const log_out = () => {
    logout();
    localStorage.removeItem("Dati");
    localStorage.removeItem("Email");
  };

  const writer = getWriterData();
  const isGuideMode = viewMode === "guides";
  const isRequestsMode = viewMode === "requests";
  const isSuggestionsMode = viewMode === "suggestions";
  const isDataMode = viewMode === "data";
  const isCreating = viewMode === "createGuide";
  const isEditing = viewMode === "editGuide";

  const actionButton = isGuideMode ? (
    <button id="Scrivi" onClick={startNewGuide}>
      Scrivi una nuova guida
    </button>
  ) : null;

  let mainContent = null;
  if (isCreating || isEditing) {
    mainContent = (
      <div className="writing">
        <label>
          <input
            id="titolo_guida"
            placeholder="Scrivi qui il titolo della guida"
            value={guideTitle}
            onChange={(event) => setGuideTitle(event.target.value)}
          />
        </label>
        <textarea
          id="testo_guida"
          placeholder={
            isEditing ? "Aggiorna qui la tua guida" : "Scrivi qui la guida"
          }
          value={guideText}
          onChange={(event) => setGuideText(event.target.value)}
        />
      </div>
    );
  } else if (isDataMode) {
    mainContent = (
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cognome</th>
            <th>
              Email{" "}
              <span
                onClick={() => {
                  setDataToChange("email");
                  setChangingData(true);
                }}
              >
                Modifica
              </span>
            </th>
            <th>
              Descrizione{" "}
              <span
                onClick={() => {
                  setDataToChange("Descrizione");
                  setChangingData(true);
                }}
              >
                Modifica
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{writer.Nome}</td>
            <td>{writer.Cognome}</td>
            <td>{writer.loginEmail}</td>
            <td>{writer.Descrizione}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  if (isRequestsMode) {
    mainContent = requests.map((ric, index) => (
      <Request
        key={index}
        text={ric.payload.richiesta}
        onClick={startNewGuideWithTitle}
      />
    ));
  }

  if (isSuggestionsMode) {
    mainContent = suggestions.map((ric, index) => (
      <Advice key={index} text={ric.text} sub={ric.sub} user={ric.user} />
    ));
  }

  if (isGuideMode) {
    mainContent = guides.map((ric, index) => (
      <Guide
        key={index}
        text={ric.testo}
        title={ric.titolo}
        author={ric.autore}
        onClick={startEditGuide}
      />
    ));
  }

  const editSection = changingData ? (
    <div id="dataValues">
      <input
        placeholder={`Nuova ${dataToChange}`}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
      />
      <button onClick={() => updateData(dataToChange, inputValue)}>
        Invia
      </button>
    </div>
  ) : (
    <span id="dataValues">{message}</span>
  );

  const actionSubmitButton = isCreating ? (
    <button onClick={addGuide}>Aggiungi guida</button>
  ) : isEditing ? (
    <button onClick={updateGuide}>Aggiorna guida</button>
  ) : null;

  return (
    <div id="container">
      <div className="richieste">
        {mainContent}
        {editSection}
        {actionButton}
        {actionSubmitButton}
      </div>
      <nav>
        <div className="sec flex gap-3 items-center " onClick={showRequests}>
          <span className="text-base">Richieste </span>
          <span className="bg-red-600 rounded-full p-4 w-4 h-4 flex items-center justify-center">
            {requests.length}
          </span>
        </div>
        <div className="sec flex gap-3 items-center" onClick={showSuggestions}>
          <span className="text-base">Suggerimenti</span>{" "}
          <span className="bg-red-600 rounded-full p-4 w-4 h-4 flex items-center justify-center">
            {suggestions.length}
          </span>
        </div>
        <div className="sec" onClick={showGuides}>
           <span className="text-base">Guide scritte </span>
        </div>
        <div className="sec" onClick={showData}>
           <span className="text-base">Dati personali </span>
        </div>
        <div className="sec">
          <Link to="/">🏠︎</Link>
        </div>
        <div className="sec">
          <Link to="/" onClick={log_out}>
            ➜
          </Link>
        </div>
      </nav>
    </div>
  );
}

export { Personal };
