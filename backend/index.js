import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import cluster from "cluster"; // Load Balancer
import filter from "content-filter"; // reliable security for MongoDB applications against the injection attacks
import morgan from "morgan";
import RateLimit from "express-rate-limit";
import passport from "passport";
import os from "os";

// Using version 1
import v1 from "./v1/index.js";

dotenv.config();

// Server port
const port = 8393;

const apiLimiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();

// apply rate limiter to all requests
app.use(apiLimiter);

app.disable("x-powered-by");

app.use(express.json());

app.set("view engine", "ejs");

app.use(
  cors({
    origin: [process.env.DB_HOST, process.env.CLIENT_HOST],
    credentials: true,
  })
);
app.options("*", cors());

app.use(cookieParser(process.env.COOKIE_KEY));

app.use(morgan("combined"));
app.use(
  session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json({ limit: "50mb" })); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" })); // for parsing application/x-www-form-urlencoded

app.use(express.static(path.join(__dirname, "public")));

app.use(filter());

app.use("/v1", v1); // Using the first version

if (process.env.API_CLUSTER) {
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    const cpuCount = os.cpus().length;
    console.log(`Total CPU ${cpuCount}`);

    // Create a worker for each CPU
    for (let worker = 0; worker < cpuCount; worker += 1) {
      cluster.fork();
    }

    // Listen for dying workers
    cluster.on("exit", function () {
      cluster.fork();
    });
  } else {
    app.listen(port, () =>
      console.log(
        `Worker ID ${process.pid}, is running on http://localhost:` + port
      )
    );
  }
} else {
  app.listen(port, () =>
    console.log(
      `Worker ID ${process.pid}, is running on http://localhost:` + port
    )
  );
}
