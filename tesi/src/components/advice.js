import React from "react";

function Advice(props) {

   const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:4200/api";

   const { text, user, sub } = props;

  const removeAdvice = () => {
    fetch(
      `${apiUrl}/writers/suggestions/remove/` +
        props.user +
        "&" +
        props.sub,
    );
    dispatchEvent(new Event("remove"));
  };

  return (
    <div className="advice">
      <div className="text1">
        {" "}
        L'utente {user} suggerisce di cambiare "{text}" con "{sub}"
      </div>
      <input type="checkbox" onClick={removeAdvice}></input>
    </div>
  );
}

export { Advice };
