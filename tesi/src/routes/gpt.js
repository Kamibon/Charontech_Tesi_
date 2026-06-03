import { ask, explain, embed, moderate } from "../../../gpt.mjs";
import { research } from "../../../qdrant.mjs";
import { fb_app, fetchGuide } from "../firebase.mjs";
import express from "express";

const gptRouter = express.Router();

gptRouter.get("/api/:q", (req, res) => {
  ask(req.params.q).then((result) => res.json({ message: result }));
});

gptRouter.post("/api/explain", (req, res) => {
  explain(req.body.text, req.body.piece).then((result) =>
    res.json({ message: result }),
  );
});

gptRouter.get("/api/find/:q", (req, res) => {
  embed(req.params.q)
    .then((emb) => research(emb, 9, "Tutorial"))
    .then((result) => fetchGuide(fb_app, result))
    .then((results) => res.json({ message: results }));
});

gptRouter.get("/api/moderate/:q", (req, res) => {
  moderate(req.params.q).then((result) => res.json({ ris: result }));
});

export { gptRouter };
