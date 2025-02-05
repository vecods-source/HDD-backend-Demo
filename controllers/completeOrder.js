import pool from "../config/dp.js";

export const completeOrder = async (req, res) => {
  const { orderId } = req.body;
  console.log(orderId);
  try {
    const query = await pool.query(
      "UPDATE orders SET status = 'Done' WHERE serial_number = ANY($1) returning *",
      [orderId]
    );
    if (query.rows.length === 0) {
      console.log(query.rows);
      return res
        .status(404)
        .json({ message: "No order found, order was not completed" });
    }
    console.log("Order completed successfully");
    return res.status(200).json({ message: "Order completed successfully" });
  } catch (err) {
    console.error("Error executing first query:", err.message);
    return res
      .status(500)
      .json({ error: "Failed to complete order: " + err.message });
  }
};
