import { getAuth } from "firebase/auth";
import { embed } from "../../../gpt.mjs";
import { add_user } from "../../../qdrant.mjs";
import {
  addAuthors,
  addSuggest,
  fb_app,
  getAuthors,
  getGuides,
  getSuggestions,
  register,
  remove,
  updateAuthor,
} from "../firebase.mjs";
import express from "express"
const writersRouter = express.Router();

const auth = getAuth(fb_app);

writersRouter.get("/guides/:q", (req, res) => {
  getGuides(fb_app, req.params.q).then((result) =>
    res.json({ message: result }),
  );
});

writersRouter.post("/reg", (req, res) => {
  register(auth, req.body.loginEmail, req.body.password);

  embed(req.body.descrizione).then((result) =>
    add_user(
      req.body.nome,
      req.body.cognome,
      req.body.descrizione,
      req.body.loginEmail,
      result,
    ),
  );
  addAuthors(fb_app, req.body);
});

writersRouter.get("/suggestions/:q", (req, res) => {
  getSuggestions(fb_app, req.params.q).then((result) =>
    res.json({ message: result }),
  );
});

writersRouter.post("/suggestions", (req, res) => {
  addSuggest(fb_app, req.body);
});

writersRouter.get("/suggestions/remove/:q1&:q2", (req, res) => {
  remove(fb_app, req.params.q1, req.params.q2);
});

writersRouter.get("/data/:q", (req, res) => {
  getAuthors(fb_app, req.params.q).then((result) =>
    res.json({ message: result }),
  );
});

writersRouter.put("/data", (req, res) => {
  updateAuthor(fb_app, req.body);
});

export { writersRouter };
