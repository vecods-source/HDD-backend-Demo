import express from "express";
// import route from "./routes/cars.js";
import authRoute from "./routes/authRoute.js";
import getbattDet from "./routes/getbattDetRoute.js";
import orderRoute from "./routes/ordersRoute.js";
import replaceRoute from "./routes/replaceRoute.js";
import searchBattRoute from "./routes/searchBattRoute.js";
import checkRoute from "./routes/checkLoginRoute.js";
import bodyParser from "body-parser";
import cors from "cors";
import sessionConfig from "./config/sessionConfig.js";
const app = express();
const port = 3030;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionConfig);
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from frontend
    credentials: true, // Allow cookies to be sent
  })
);

// app.use("/api", route);
app.use("/", authRoute);
app.use("/", checkRoute);
app.use("/api", getbattDet);
app.use("/api", orderRoute);
app.use("/api", replaceRoute);
app.use("/api", searchBattRoute);

app.listen(port, () => {
  console.log(`running on portnum https/localhost:${port}`);
});
