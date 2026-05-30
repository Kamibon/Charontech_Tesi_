import React from "react";

function Advice(props) {
  const removeAdvice = () => {
    fetch(
      "http://localhost:4200/api/writers/suggestions/remove/" +
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
        L'utente {props.user} suggerisce di cambiare "{props.testo}" con "{props.sub}"
      </div>
      <input type="checkbox" onClick={removeAdvice}></input>
    </div>
  );
}

export { Advice };
