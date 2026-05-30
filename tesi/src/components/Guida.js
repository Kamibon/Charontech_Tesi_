import React, { useState, useEffect } from "react";

function Guida(props) {
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState("Mi piace");

  const {autore, titolo, testo, onClick} = props;
 
  useEffect(() => {
    fetch(
      "http://localhost:4200/api/guides/like/get/" + autore + "&" + titolo,
    )
      .then((response) => response.json())
      .then((json) => checkLikes(json))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.autore, props.titolo]);

  function checkLikes(json) {
    setLikes(json.message);
    if (json.message.length > 0) {
      for (let item of json.message) {
        if (localStorage.getItem("normalEmail") != null) {
          if (item.user === JSON.parse(localStorage.getItem("normalEmail")).username) {
            setLiked("Piaciuto");
            break;
          }
        }
      }
    }
  }

  return (
    <div
      className="guida"
      onClick={(event) => onClick(event)}
      data-autore={autore}
      data-titolo={titolo}
      data-testo={testo}
      data-liked={liked}
    >
      <div className="titolo">
        {" "}
        {titolo}
        <br />
      </div>
      <div className="testo">{testo} </div>
      <div className="interactions">
        <span>Mi piace : {likes.length}</span>
      </div>
    </div>
  );
}

export { Guida };
