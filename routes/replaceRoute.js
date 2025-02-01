import express from "express";
import replace from "../controllers/orderReplace.js";
import isAuthorized from "../middlewares/isAuthorizedMW.js";

const { getSerialBattery, getWarrantyCard, replaceBatt } = replace;
const { isAuthenticated, isAdmin } = isAuthorized;
const route = express.Router();

route.post("/getWarrantyCard", isAuthenticated, isAdmin, getWarrantyCard);
route.post("/getSerialBattery", isAuthenticated, isAdmin, getSerialBattery);
route.post("/replace-battery", isAuthenticated, isAdmin, replaceBatt);
export default route;
