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
  cookie: { secure: true, httpOnly: true, maxAge: 3600000, sameSite: "lax" },
});

export default sessionConfig;
