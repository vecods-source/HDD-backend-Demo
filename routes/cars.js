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

route.post("/get-battery-det", async (req, res) => {
  const { battery_name } = req.body;

  try {
    const data = await pool.query(
      "SELECT serial_number, tech_id FROM current_batteries WHERE battery_name = $1 AND battery_status IN ('Loaded', 'Stock') ORDER BY CASE WHEN battery_status = 'Loaded' THEN 1 ELSE 2 END LIMIT 1;",
      [battery_name]
    );
    if (data.rows.length === 0)
      return res.status(404).json({ message: "No Stock or Loaded batteries" });
    console.log("data found: " + data);
    res.status(200).json(data.rows[0]);
  } catch (err) {
    console.log("catch error: " + err);
    res.status(500).json({ message: "battery not found" });
  }
});

route.get("/get-orders", async (req, res) => {
  try {
    const data = await pool.query(
      "SELECT total_price, discount, delievery_fees, payment_method, installed_by, serial_number,status,sold_date FROM orders WHERE status = 'Pending'"
    );

    if (data.rowCount > 0) {
      const dataTosend = data.rows;

      for (const element of dataTosend) {
        const batteryResult = await pool.query(
          "SELECT battery_name FROM current_batteries WHERE serial_number = $1;",
          [element.serial_number]
        );

        element.battery_name = batteryResult.rows[0]?.battery_name || null;
      }

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

route.post("/insert-order", async (req, res) => {
  const {
    driver,
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
    serial_number,
  } = req.body;
  let driverID;
  console.log(driver);
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
      driverID = null;
      console.log("Driver not found.");
      break;
  }
  try {
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
    console.log("error inserting data " + err);
    res.status(500).json({ message: "catch error" });
  }
});
route.post("/getWarrantyCard", async (req, res) => {
  const { WarrantyCard } = req.body;
  const response = await pool.query(
    "SELECT sold_date FROM orders WHERE warranty_card=$1 LIMIT 1",
    [WarrantyCard]
  );
  if (response.rowCount == 0) {
    return res.status(404).json({ message: "Battery Not Found" });
  }
  const start_date = response.rows[0].sold_date;
  const timeL = timeLeft(start_date);
  res.status(200).json(timeL);
});
route.post("/getSerialBattery", async (req, res) => {
  const { Rserial } = req.body;
  console.log(Rserial);
  const response = await pool.query(
    "SELECT sold_date FROM orders WHERE serial_number=$1 LIMIT 1",
    [Rserial]
  );
  console.log(response);
  if (response.rowCount == 0) {
    return res.status(404).json({ message: "Battery Not Found" });
  }
  const start_date = response.rows[0].sold_date;
  const timeL = timeLeft(start_date);
  res.status(200).json(timeL);
});

function timeLeft(isoDate) {
  const dateToCheck = new Date(isoDate);
  const dateAfterOneYear = new Date(dateToCheck);
  dateAfterOneYear.setFullYear(dateAfterOneYear.getFullYear() + 1);

  const currentDate = new Date();

  const timeDifference = dateAfterOneYear - currentDate;

  if (timeDifference < 0) {
    const exceededDays = Math.abs(
      Math.floor(timeDifference / (1000 * 60 * 60 * 24))
    );
    const exceededMonths = Math.floor(exceededDays / 30);
    const days = exceededDays % 30;

    return { exceeded: true, months: exceededMonths, days };
  }

  const totalDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;

  return { exceeded: false, months, days };
}

route.post("/add-to-returned", async (req, res) => {
  const { serial_number, claim_rec, newSN } = req.body;
  console.log(claim_rec);
  const present = new Date().toISOString().split("T")[0];
  try {
    await pool.query(
      "UPDATE current_batteries SET battery_status = 'Replaced', date_returned = $1 WHERE serial_number = $2",
      [present, serial_number]
    );
    await pool.query(
      "UPDATE orders SET serial_number = $1, replaced_with = $2, rec_number= $3 WHERE serial_number = $4",
      [newSN, serial_number, claim_rec, serial_number]
    );
    res.status(200).json({ message: "row updated succesfully" });
  } catch (err) {
    res.status(500).json({ message: "error with the queries" });
    console.log(err);
  }
});
export default route;
