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
    let counters = {
      counter1: 0,
      counter2: 0,
      counter3: 0,
      counter4: 0,
      counter5: 0,
    };
    data.rows.forEach((element) => {
      if (element.tech_id >= 1 && element.tech_id <= 5) {
        counters[`counter${element.tech_id}`]++;
      }
    });
    const newData = { ...data.rows[0], counters };
    res.status(200).json(newData);
  } catch (err) {
    console.log("catch error: " + err);
    res.status(500).json({ message: "battery not found" });
  }
};

export default { battDet };
