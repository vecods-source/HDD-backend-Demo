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
    const data = await pool.query(query, [driveriD]);
    console.log(data.rows);
    console.log("no data found");
    if (data.rows.length > 0) {
      console.log("data exist and sent");
      console.log(data.rows);
      return res.status(200).json({ data: data.rows });
    }
    console.log("no orders found for the driver with id: ", driveriD);
    return res.status(200).json({ message: "No orders for this driver" });
  } catch (err) {
    console.log("erro with the database: ", err.message);
    res.status(501).json({ message: err.message });
  }
};
