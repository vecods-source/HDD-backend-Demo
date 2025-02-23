import express from "express";
import authRoute from "./routes/authRoute.js";
import getbattDet from "./routes/getbattDetRoute.js";
import orderRoute from "./routes/ordersRoute.js";
import replaceRoute from "./routes/replaceRoute.js";
import searchBattRoute from "./routes/searchBattRoute.js";
import checkRoute from "./routes/checkLoginRoute.js";
import bodyParser from "body-parser";
import cors from "cors";
import sessionConfig from "./config/sessionConfig.js";
import driverRoute from "./routes/driverRout.js";
import updateorderRoute from "./routes/updateOrderRoute.js";
import cancelRoute from "./routes/cancelRout.js";
import completeRoute from "./routes/completeOrder.js";
import editOrder from "./routes/editOrder.js";
import getSerials from "./routes/getSerials.js";
const app = express();
const port = process.env.PORT || 3030;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("trust proxy", 1);

app.use(sessionConfig);
app.use(
  cors({
    origin: "https://hdd-management-system1.vercel.app",
    credentials: true,
  })
);
app.use((req, res, next) => {
  console.log("Request Headers: ", req.headers);
  next();
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Origin",
    "https://hdd-management-system1.vercel.app"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/", authRoute);
app.use("/", checkRoute);
app.use("/api", editOrder);
app.use("/api", getbattDet);
app.use("/api", orderRoute);
app.use("/api", replaceRoute);
app.use("/api", searchBattRoute);
app.use("/api", driverRoute);
app.use("/api", updateorderRoute);
app.use("/api", cancelRoute);
app.use("/api", completeRoute);
app.use("/api", getSerials);
app.listen(port, () => {
  console.log(`running on portnum https/localhost:${port}`);
});
