const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("./config/database");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const usersRouter = require("./routes/users");

const app = express();

const PROD_EXACT = ["https://dev-tinder-frontend-vert.vercel.app"];

function allowOrigin(origin) {
    try {
    const u = new URL(origin);
    if (PROD_EXACT.includes(origin)) return origin;
    if (u.hostname.endsWith(".vercel.app")) return origin; // preview URLs
    return false;
  } catch {
    return false;
  }
}

app.use((req, _res, next) => { if (req.headers.origin) console.log("CORS origin:", req.headers.origin); next(); });

app.use(cors({
  origin: (origin, cb) => {
    const allowed = allowOrigin(origin);
    cb(null, allowed || false); // pass the origin string (echo) or false
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", usersRouter);

const PORT = process.env.PORT || 3000;
app.get("/", (_req, res) => res.send("Backend is running"));
app.get("/healthz", (_req, res) => res.json({ status: "ok" }));
app.listen(PORT, () => console.log("Server listening on", PORT));