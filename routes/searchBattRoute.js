import express from "express";
import search from "../controllers/searchCarController.js";
import isAuthorized from "../middlewares/isAuthorizedMW.js";

const { searchBatt, searchCar } = search;
const { isAuthenticated, isAdmin } = isAuthorized;
const route = express.Router();

route.post("/searchCar", isAuthenticated, isAdmin, searchCar);

route.post("/searchBattery", isAuthenticated, isAdmin, searchBatt);

export default route;
