import React from "react";

function Request(props) {
  return (
    <div className="request" data-testo={props.text} onClick={props.onClick}>
      <span className="text1"> {props.text}</span>
    </div>
  );
}

export { Request };
