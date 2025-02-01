import express from "express";
import { check } from "../controllers/checkLogin.js";

const route = express.Router();
route.get("/check-session", check);

export default route;
