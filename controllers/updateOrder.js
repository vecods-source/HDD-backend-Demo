import pool from "../config/dp.js";
export const updateOrder = async (req, res) => {
  const {
    orderSerial,
    serialNumber,
    paymethod,
    warranty_card,
    rec_number,
    note,
    driverid,
  } = req.body;
  console.log(serialNumber);
  try {
    const query = `
            UPDATE orders
            SET 
                note = $1,
                warranty_card = $2,
                rec_number = $3,
                payment_method = $4,
                is_delivered = 'Yes',
                installed_by = $6,
                serial_number = $7
            WHERE serial_number = $5
        `;
    const values = [
      note,
      warranty_card,
      rec_number,
      paymethod,
      orderSerial,
      driverid,
      serialNumber,
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    console.log(
      `Order with serial number ${serialNumber} updated successfully`
    );
    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
