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
  saveUninitialized: true,
  cookie: { secure: true, httpOnly: true, maxAge: 3600000, sameSite: "none" },
  domain: ".hdd-management-system1.vercel.app",
});

export default sessionConfig;
