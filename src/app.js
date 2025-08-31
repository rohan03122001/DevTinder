const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("./config/database");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const usersRouter = require("./routes/users");

const app = express();

const allowed =
  (process.env.CORS_ORIGINS || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

app.use(cors({ origin: allowed.length ? allowed : undefined, credentials: true }));
app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server listening on", PORT);
});
