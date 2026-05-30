import React from "react";

function Comment(props) {
  return (
    <div className="commento">
      <pre>
        <div>
          {" "}
          <em>{props.user}</em> : {props.testo}{" "}
        </div>
      </pre>
    </div>
  );
}

export { Comment };
