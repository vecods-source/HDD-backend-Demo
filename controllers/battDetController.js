const battDet = async (req, res) => {
  const { batteryName } = req.body;

  try {
    const data = await pool.query(
      "SELECT serial_number, tech_id FROM current_batteries WHERE battery_name = $1 AND battery_status IN ('Loaded', 'Stock') ORDER BY CASE WHEN battery_status = 'Loaded' THEN 1 ELSE 2 END LIMIT 1;",
      [batteryName]
    );
    if (data.rows.length === 0)
      return res.status(404).json({ message: "No Stock or Loaded batteries" });
    console.log("data found: " + data);
    res.status(200).json(data.rows[0]);
  } catch (err) {
    console.log("catch error: " + err);
    res.status(500).json({ message: "battery not found" });
  }
};

export default { battDet };
