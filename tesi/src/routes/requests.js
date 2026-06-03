import { embed } from "../../../gpt.mjs";
import { add_request, research } from "../../../qdrant.mjs";
import express from "express"

export const requestsRouter = express.Router();

requestsRouter.get("/api/requests/:q", (req, res) => {
  embed(req.params.q).then((des) => add_request(req.params.q, des));
});

requestsRouter.get("/api/requests/:q", (req, res) => {
  embed(req.params.q)
    .then((emb) => research(emb, 6, "Richieste"))
    .then((result) => res.json({ message: result }));
});
