import pool from "../config/dp.js";

const searchCar = async (req, res) => {
  const { carName, carModel, carYear } = req.body;
  console.log(carName, carModel, carYear);
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
    res.status(200).json(responseData);
    responseData = [];
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const searchBatt = async (req, res) => {
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
};

export default { searchBatt, searchCar };
