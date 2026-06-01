// JavaScript source code

import { getAuth } from "firebase/auth";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require("express");

const cors = require("cors");

import {
  addAuthors,
  addComment,
  addGuide,
  addLike,
  addSuggest,
  changeEmail,
  fb_app,
  fetchGuide,
  getAuthors,
  getComments,
  getGuides,
  getLikes,
  getSuggestions,
  register,
  remove,
  removeLike,
  updateAuthor,
  updateGuide,
} from "./tesi/src/firebase.mjs";
import {
  add_guide,
  add_request,
  get_coll,
  client,
  add,
  create_coll,
  retrieve,
  retrieveAuthor,
  retrieveGuide,
  research,
  add_user,
} from "./qdrant.mjs";
import { embed, ask, moderate, create_image, explain } from "./gpt.mjs";
import * as session from "express-session";

const auth = getAuth(fb_app);
const PORT = process.env.PORT || 4200;
const guidesRouter = require("./tesi/src/routes/guides.js").guidesRouter;
const writersRouter = require("./tesi/src/routes/writers.js").writersRouter;

const app = express();
app.use(cors());
app.use(express.json());

/*app.use(session({
    secret:"thisisasecretnobodyhastoknow",
    cookie: {
        sameSite:'strict'
    }
}))*/

app.use(guidesRouter);
app.use(writersRouter);

app.get("/api/:q", (req, res) => {
  ask(req.params.q).then((result) => res.json({ message: result }));
});

app.post("/api/explain", (req, res) => {
  explain(req.body.text, req.body.piece).then((result) =>
    res.json({ message: result }),
  );
});

app.get("/api/find/:q", (req, res) => {
  embed(req.params.q)
    .then((emb) => research(emb, 9, "Tutorial"))
    .then((result) => fetchGuide(fb_app, result))
    .then((results) => res.json({ message: results }));
});

app.get("/api/moderate/:q", (req, res) => {
  moderate(req.params.q).then((result) => res.json({ ris: result }));
});

app.get("/api/requests/:q", (req, res) => {
  embed(req.params.q).then((des) => add_request(req.params.q, des));
});

app.get("/api/requests/:q", (req, res) => {
  embed(req.params.q)
    .then((emb) => research(emb, 6, "Richieste"))
    .then((result) => res.json({ message: result }));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
