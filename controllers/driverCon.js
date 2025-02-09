import pool from "../config/dp.js";

export const connectOrderDriver = async (req, res) => {
  console.log("connectOrderDriver route");
  const { driverId } = req.body;
  console.log(driverId);
  const driveriD = parseInt(driverId, 10);

  if (isNaN(driverId)) {
    console.log("Invalid user ID provided: " + driverId);
    return res
      .status(400)
      .json({ error: "Invalid user ID provided: " + driverId });
  }
  try {
    const query =
      "SELECT * FROM orders WHERE installed_by=$1 AND status='Pending' AND is_delivered='No'";
    const query2 =
      "SELECT battery_name FROM current_batteries WHERE serial_number = $1;";
    const data = await pool.query(query, [driveriD]);

    if (data.rows.length > 0) {
      console.log("length ", data.rows.length);
      const batteryNames = await Promise.all(
        data.rows.map(async (order) => {
          const batteryQuery = `SELECT battery_name FROM current_batteries WHERE serial_number = $1;`;
          const batteryResult = await pool.query(batteryQuery, [
            order.serial_number,
          ]);

          return batteryResult.rows.length > 0
            ? batteryResult.rows[0].battery_name
            : null;
        })
      );
      console.log("data exist and sent");
      const FullData = data.rows.map((order, index) => ({
        ...order,
        battery_name: batteryNames[index],
      }));
      console.log(FullData);
      // console.log(data.rows);
      return res.status(200).json({ data: FullData });
    }
    console.log("no orders found for the driver with id: ", driveriD);
    return res.status(200).json({ message: "No orders for this driver" });
  } catch (err) {
    console.log("erro with the database: ", err.message);
    res.status(501).json({ message: err.message });
  }
};
