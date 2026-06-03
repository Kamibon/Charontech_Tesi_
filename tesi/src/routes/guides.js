import { embed } from "../../../gpt.mjs";
import {
    add_guide
} from "../../../qdrant.mjs";
import {
    addComment,
    addGuide,
    addLike,
    fb_app,
    getComments,
    getLikes,
    removeLike,
    updateGuide
} from "../firebase.mjs";
import express from "express"
const guidesRouter = express.Router();

guidesRouter.post("/add", (req, res) => {
  embed(req.body.testo).then((result) =>
    add_guide(req.body.titolo, req.body.autore, req.body.testo, result),
  );
  addGuide(fb_app, req.body.titolo, req.body.testo, req.body.autore);
});

guidesRouter.get("/comment/:q1&:q2", (req, res) => {
  getComments(fb_app, req.params.q1, req.params.q2).then((result) =>
    res.json({ message: result }),
  );
});

guidesRouter.post("/comments", (req, res) => {
  addComment(fb_app, req.body);
});

guidesRouter.post("/like", (req, res) => {
  addLike(fb_app, req.body);
});

guidesRouter.get("/like/:q1&:q2", (req, res) => {
  getLikes(fb_app, req.params.q1, req.params.q2).then((result) =>
    res.json({ message: result }),
  );
});

guidesRouter.delete(
  "/like/:user&:autore&:titolo",
  (req, res) => {
    removeLike(fb_app, req.params.user, req.params.autore, req.params.titolo);
  },
);

guidesRouter.put("/api/guides", (req, res) => {
  updateGuide(fb_app, req.body);
});

export { guidesRouter };
