import React, { useState, useEffect } from "react";

function Guide(props) {
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState("Mi piace");

  const { author, title, text, onClick } = props;

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:4200/api";

  useEffect(() => {
    fetch(`${apiUrl}/guides/like/${author}&${title}`)
      .then((response) => response.json())
      .then((json) => checkLikes(json))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [author, title]);

  function checkLikes(json) {
    setLikes(json.message);
    if (json.message.length > 0) {
      for (let item of json.message) {
        if (localStorage.getItem("normalEmail") != null) {
          if (
            item.user ===
            JSON.parse(localStorage.getItem("normalEmail")).username
          ) {
            setLiked("Piaciuto");
            break;
          }
        }
      }
    }
  }

  return (
    <div
      className="
    group
    w-full max-w-md
    cursor-pointer
    overflow-hidden
    rounded-2xl
    border border-red-100
    border-l-4 border-l-red-600
    bg-white
    max-h-[40%]
    flex flex-col items-center
    p-5
    shadow-md
    transition-all duration-300
    hover:-translate-y-1
    hover:shadow-xl
    hover:border-red-300
  "
      onClick={onClick}
      data-author={author}
      data-title={title}
      data-text={text}
      data-liked={liked}
    >
      <h3 className="mb-3 text-lg font-bold text-red-700 group-hover:text-red-600">
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-gray-600 line-clamp-3">
        {text}
      </p>

      <div
        className="
      mt-4
      flex
      items-center
      justify-between
      border-t
      border-gray-100
      pt-3
      text-sm
      text-gray-500
    "
      >
        <span className="font-medium">❤️ {likes.length}</span>

        <span className="text-xs text-gray-400">{author}</span>
      </div>
    </div>
  );
}

export { Guide };
