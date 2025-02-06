import express from "express";
import isAuthorized from "../middlewares/isAuthorizedMW.js";
import { editOrderAdmin } from "../controllers/editOrderAdmin.js";

const { isAuthenticated, isAdmin } = isAuthorized;
const route = express.Router();

route.put("/edit-order", isAuthenticated, isAdmin, editOrderAdmin);

export default route;
