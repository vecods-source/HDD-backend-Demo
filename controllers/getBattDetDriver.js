import pool from "../config/dp.js";

export const batterySerials = async (req, res) => {
  console.log(req.body.battery_name, req.body.tech_id);
  try {
    const data = await pool.query(
      "SELECT serial_number, date_recieved FROM current_batteries WHERE battery_name = $1 AND battery_status = 'Loaded' AND tech_id = $2 ORDER BY date_recieved ASC;",
      [req.body.battery_name, req.body.tech_id]
    );
    console.log(data.rows);
    if (data.rows.length === 0)
      return res.status(404).json({ message: "No Stock or Loaded batteries" });
    console.log("available batteries: " + data.rows);
    res.status(200).json(data.rows);
  } catch (err) {
    console.log("catch error: " + err);
    res.status(500).json({ message: "battery not found" });
  }
};
