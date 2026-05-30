import React from "react";

function Request(props) {
  return (
    <div className="request" data-testo={props.testo} onClick={props.onClick}>
      <span className="text1"> {props.testo}</span>
    </div>
  );
}

export { Request };
