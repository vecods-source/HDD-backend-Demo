import pool from "../config/dp.js";

export const editOrderAdmin = async (req, res) => {
  const {
    total_price,
    payment_method,
    installed_by,
    serial_number,
    status,
    sold_date,
  } = req.body;
  console.log("this is the data being sent ", req.body);

  try {
    const data = await pool.query(
      "UPDATE orders SET total_price=$1, payment_method=$2, installed_by=$3, status=$4, sold_date=$5 WHERE serial_number=$6 RETURNING *",
      [
        total_price,
        payment_method,
        installed_by,
        status,
        sold_date,
        serial_number,
      ]
    );

    if (data.rowCount > 0) {
      console.log("this is the respond: ", data.rows[0]);
      res
        .status(200)
        .json({ message: "Order updated successfully", data: data.rows[0] });
    } else {
      console.log("No rows found");
      res.status(404).json({ message: "No orders found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
