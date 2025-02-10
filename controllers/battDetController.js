import pool from "../config/dp.js";
const battDet = async (req, res) => {
  const { batteryName } = req.body;

  try {
    const data = await pool.query(
      "SELECT serial_number, tech_id FROM current_batteries WHERE battery_name = $1 AND battery_status='Loaded'",
      [batteryName]
    );

    if (data.rows.length === 0)
      return res.status(404).json({ message: "No Stock or Loaded batteries" });
    console.log("data found: " + data);
    // await pool.query(
    //   "UPDATE current_batteries SET battery_status = 'Sold' WHERE serial_number = $1",
    //   [data.rows[0].serial_number]
    // );
    res.status(200).json(data.rows[0]);
  } catch (err) {
    console.log("catch error: " + err);
    res.status(500).json({ message: "battery not found" });
  }
};

export default { battDet };
