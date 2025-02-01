import express from "express";
import isAuthorized from "../controllers/isAuthorized.js";

const { login, logout, register } = isAuthorized;

const route = express.Router();

route.post("/login", login);
route.post("/register", register);
route.post("/logout", logout);

// Export the router
export default route;
