import express from "express";
import pool from "../dp.js";
import bodyParser from "body-parser";
const route = express.Router();

route.use(bodyParser.urlencoded({ extended: true }));

route.post("/searchCar", async (req, res) => {
  const { carName, carModel, carYear } = req.body;

  const carYearn = parseInt(carYear, 10);

  if (isNaN(carYearn)) {
    return res
      .status(400)
      .json({ error: "Invalid carYear provided: " + carYear });
  }

  try {
    let responseData = [];
    const result = await pool.query(
      "SELECT DISTINCT *, (similarity(car_manufacturer, $1) * 0.5 + similarity(model_name, $2) * 0.5 - ABS(model_year - $3) * 0.1) AS closeness_score FROM car_search WHERE similarity(car_manufacturer, $1) > 0.4 AND similarity(model_name, $2) > 0.4 AND model_year BETWEEN $3 - 2 AND $3 + 2 ORDER BY closeness_score DESC;",
      [carName, carModel, carYearn]
    );

    for (const row of result.rows) {
      const batteryResult = await pool.query(
        "SELECT battery_price FROM battery_search WHERE similarity(battery_name, $1) > 0.5",
        [row.battery_name]
      );
      const battery_price = batteryResult.rows[0].battery_price;
      responseData.push({ ...row, battery_price });
    }
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: `No matching batteries found for Car: ${carName}, Model: ${carModel}, Year: ${carYear} try again`,
      });
    }
    // pool.query("INSERT INTO orders ($1,$2,$3,$4,$5) WHERE status stock");
    res.status(200).json(responseData);
    responseData = [];
  } catch (err) {
    res.status(500).json({ error: "Cought error" });
  }
});

route.post("/searchBattery", async (req, res) => {
  const { batteryName } = req.body;

  try {
    const response = await pool.query(
      "SELECT distinct battery_price, battery_name FROM battery_search WHERE similarity(battery_name, $1) > 0.9;",
      [batteryName]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({ message: "No matching batteries found." });
    }

    res.status(200).json(response.rows);
  } catch (err) {
    console.log("error:", err);
    res.status(500).json({ error: err.message });
  }
});

route.post("/add-order", async (req, res) => {
  const {
    driver,
    battery_name,
    date,
    discount,
    delieveryFees,
    totalPrice,
    name,
    phone,
    carMake,
    carModel,
    carYear,
    carPlate,
    time,
    // cAddress,
  } = req.body;
  try {
    const data = await pool.query(
      "SELECT serial_number FROM current_batteries WHERE battery_name = $1 AND battery_status IN ('Loaded', 'Stock') ORDER BY CASE WHEN battery_status = 'Loaded' THEN 1 ELSE 2 END LIMIT 1;",
      [battery_name]
    );
    if (data.rows === 0)
      return res.status(404).json({ message: "No Stock or Loaded batteries" });
    const serial_number = data.rows[0].serial_number;
    console.log(serial_number);
    let driverID;

    switch (driver) {
      case "Sikandar":
        driverID = 1;
        break;
      case "Jawad":
        driverID = 2;
        break;
      case "Loay":
        driverID = 3;
        break;
      case "Abdulrahman":
        driverID = 4;
        break;
      case "Anwar":
        driverID = 5;
        break;
      default:
        driverID = null; // Default case if no match
        console.log("Driver not found.");
        break;
    }
    const insertQue = await pool.query(
      "INSERT INTO orders (installed_by, serial_number,sold_date,discount,delievery_fees,total_price,status,cname,cphone,ccarman,ccarmodelname,ccarmodelyear,ccarplatenumber,delievery_time) VALUES ($1,$2,$3,$4,$5,$6,'Pending',$7,$8,$9,$10,$11,$12,$13) RETURNING *;",
      [
        driverID,
        serial_number,
        date,
        discount,
        delieveryFees,
        totalPrice,
        name,
        phone,
        carMake,
        carModel,
        carYear,
        carPlate,
        time,
        // cAddress,
      ]
    );

    if (insertQue.rowCount > 0) {
      console.log("row inserted succesfully");
      res.status(200).json({ message: "row inserted succesfully" });
    } else {
      console.log("error inserting the row");
      res.status(404).json({
        message: "error inserting the row probably from your inserted data",
      });
    }
  } catch (err) {
    console.log("Nice try " + err);
    res.status(500).json({ message: "catch error" });
  }
});
route.get("/get-orders", async (req, res) => {
  try {
    const data = await pool.query(
      "SELECT total_price, discount, delievery_fees, payment_method, installed_by, serial_number FROM orders WHERE status = 'Pending'"
    );

    if (data.rowCount > 0) {
      const dataTosend = data.rows;

      for (const element of dataTosend) {
        const batteryResult = await pool.query(
          "SELECT battery_name FROM current_batteries WHERE serial_number = $1;",
          [element.serial_number]
        );

        // Add the battery_name to the current object
        element.battery_name = batteryResult.rows[0]?.battery_name || null;
      }

      // Log and respond after all battery names are added
      console.log(dataTosend);
      res.status(200).json(dataTosend);
    } else {
      console.log("No rows found");
      res.status(404).json({ message: "No pending orders found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// name: "",
// phone: "",
// carPlate: "",
// time: "",
// date: "",
// driver: "",
// discount: "",
// delieveryFees: "",
// Additional API Endpoints (currently unused)
route.get("/api/getbatteryname", (req, res) => {});
route.get("/api/getbatterycar", (req, res) => {});

export default route;
