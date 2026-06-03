import "dotenv/config";
import { createRequire } from "module";
import { gptRouter } from "./tesi/src/routes/gpt.js";
import { guidesRouter } from "./tesi/src/routes/guides.js";
import { requestsRouter } from "./tesi/src/routes/requests.js";
import { writersRouter } from "./tesi/src/routes/writers.js";
const require = createRequire(import.meta.url);
const express = require("express");

const cors = require("cors");

const PORT = process.env.PORT || 4200;

const app = express();
app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err);

  const status = err.statusCode || err.status || 500;

  res.status(status).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

app.use("/api/guides", guidesRouter);
app.use("/api/writers", writersRouter);
app.use(gptRouter);
app.use(requestsRouter);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
