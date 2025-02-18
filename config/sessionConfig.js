import session from "express-session";
import pgSession from "connect-pg-simple";
import pool from "./dp.js";
const PgSession = pgSession(session);

const sessionConfig = session({
  store: new PgSession({
    pool,
    tableName: "session",
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: false, maxAge: null, sameSite: "none" },
});

export default sessionConfig;
