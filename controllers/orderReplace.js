import timeF from "../utils/helpers.js";
import pool from "../config/dp.js";
const { timeLeft } = timeF;
const getWarrantyCard = async (req, res) => {
  const { WarrantyCard } = req.body;
  const response = await pool.query(
    "SELECT sold_date, serial_number FROM orders WHERE warranty_card=$1 LIMIT 1",
    [WarrantyCard]
  );
  const serial_number = response.rows[0].serial_number;
  const response2 = await pool.query(
    "SELECT battery_name FROM current_batteries WHERE serial_number=$1",
    [serial_number]
  );
  if (response.rowCount == 0) {
    return res.status(404).json({ message: "Battery Not Found" });
  }
  const battery_name = response2.rows[0].battery_name;
  const start_date = response.rows[0].sold_date;
  const timeL = timeLeft(start_date);
  const dataTosend = { ...timeL, battery_name, serial_number };
  console.log(dataTosend);
  res.status(200).json(dataTosend);
};
const getSerialBattery = async (req, res) => {
  const { Rserial } = req.body;
  console.log(Rserial);
  try {
    const response = await pool.query(
      "SELECT sold_date FROM orders WHERE serial_number=$1 LIMIT 1",
      [Rserial]
    );
    const response2 = await pool.query(
      "SELECT battery_name FROM current_batteries WHERE serial_number = $1",
      [Rserial]
    );
    console.log(response);
    if (response.rowCount == 0) {
      return res.status(404).json({ message: "Battery Not Found" });
    }
    const start_date = response.rows[0].sold_date;
    const batteryName = response2.rows[0].battery_name;
    const timeL = timeLeft(start_date);
    console.log(batteryName);
    const dataTosend = { ...timeL, batteryName };
    res.status(200).json(dataTosend);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
const replaceBatt = async (req, res) => {
  const { Rserial, NSerial, time, address, driver } = req.body;
  const present = new Date().toISOString().split("T")[0];
  let driverID = 0;
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
    console.log("Installed By: ", driverID);
    await pool.query(
      "UPDATE current_batteries SET battery_status = 'Replaced', date_returned = $1 WHERE serial_number = $2",
      [present, Rserial]
    );
    await pool.query(
      "UPDATE current_batteries SET battery_status = 'Replaced' WHERE serial_number = $1",
      [NSerial]
    );
    await pool.query(
      "UPDATE orders SET serial_number = $1, replaced_with = $2, replace_date=$3, delievery_time=$4, caddress=$5, installed_by=$6, is_delivered= 'No', status= 'Pending' WHERE serial_number = $7",
      [NSerial, Rserial, present, time, address, driverID, Rserial]
    );
    res.status(200).json({ message: "battery updated succesfully" });
  } catch (err) {
    res.status(500).json({ message: "error with the queries" });
    console.log(err);
  }
};
export default { getSerialBattery, getWarrantyCard, replaceBatt };
