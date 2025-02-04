import pool from "../config/dp.js";

export const cancelController = async (req, res) => {
  const { serial_number } = req.body;
  try {
    // First query: Update order status
    let data;
    try {
      const query =
        "UPDATE orders SET status = 'Cancelled' WHERE serial_number = $1 returning *";
      const inputs = [serial_number];
      data = await pool.query(query, inputs);
      console.log("First query result:", data); // Log to verify query result
    } catch (err) {
      console.error("Error executing first query:", err.message); // Catch error for first query
      return res
        .status(500)
        .json({ error: "Failed to cancel order: " + err.message });
    }

    // Second query: Update battery status
    let data2;
    try {
      const query2 =
        "UPDATE current_batteries SET battery_status = 'Stock' WHERE serial_number = $1 returning *";
      const inputs = [serial_number];
      data2 = await pool.query(query2, inputs);
      console.log("Second query result:", data2); // Log to verify query result
    } catch (err) {
      console.error("Error executing second query:", err.message); // Catch error for second query
      return res
        .status(500)
        .json({ error: "Failed to update battery status: " + err.message });
    }

    // If no rows were affected in either query, return an error response
    if (data2.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No battery found, order was not cancelled" });
    }
    if (data.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No order found, order was not cancelled" });
    }

    console.log("Order cancelled successfully");
    return res.status(200).json({ message: "Order cancelled successfully" });
  } catch (err) {
    console.log("Unexpected error:", err.message);
    return res
      .status(500)
      .json({ error: "An unexpected error occurred: " + err.message });
  }
};
