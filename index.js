import express from "express";
import route from "./routes/cars.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 3030;

app.use(bodyParser.json());
app.use(cors());

app.use("/api", route);
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(port, () => {
  console.log(`running on portnum https/localhost:${port}`);
});
