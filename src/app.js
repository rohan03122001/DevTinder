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
const isAllowedOrigin = (origin) => {
  if (!origin) return false;
  try {
    const url = new URL(origin);
    if (PROD_EXACT.includes(origin)) return true;
    if (url.hostname.endsWith(".vercel.app")) return true; // allow previews
    return false;
  } catch {
    return false;
  }
};

app.use(
  cors({
    origin: (origin, cb) => cb(null, isAllowedOrigin(origin)),
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", usersRouter);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Backend is running"));
app.get("/healthz", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log("Server listening on", PORT);
});