import pool from "../config/dp.js";
const getOrders = async (req, res) => {
  try {
    const data = await pool.query(
      //status pending or done meaning status to the accountant system.
      //order status like cancelled, delivered, replace, free, or lost
      "SELECT total_price, discount, delievery_fees, payment_method, installed_by, serial_number,status,sold_date,order_status,is_delivered,rec_number,warranty_card FROM orders WHERE status = 'Pending' ORDER BY sold_date"
    );

    if (data.rowCount > 0) {
      const dataTosend = data.rows;

      for (const element of dataTosend) {
        const batteryResult = await pool.query(
          "SELECT battery_name FROM current_batteries WHERE serial_number = $1;",
          [element.serial_number]
        );

        element.battery_name = batteryResult.rows[0]?.battery_name || null;
      }
      const filteredData = dataTosend.filter(
        (order) => order.serial_number !== null
      );
      console.log(filteredData);
      res.status(200).json(filteredData);
    } else {
      console.log("No rows found");
      res.status(404).json({ message: "No pending orders found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const inserOrder = async (req, res) => {
  const {
    driver,
    date,
    discount,
    deliveryFees,
    totalPrice,
    name,
    phone,
    carMake,
    carModel,
    carYear,
    carPlate,
    time,
    serial_number,
  } = req.body;
  let driverID;
  console.log("Data recieved from the clietn.....", req.body);
  console.log("Fees delievery from client ", deliveryFees);
  console.log(driver);
  switch (driver) {
    case "Sikandar":
      driverID = 1;
      break;
    case "Jawad":
      driverID = 2;
      break;
    case "Loay":
      driverID = 3;
      break;
    case "Abdulrahman":
      driverID = 4;
      break;
    case "Anwar":
      driverID = 5;
      break;
    default:
      driverID = null;
      console.log("Driver not found.");
      break;
  }
  try {
    const insertQue = await pool.query(
      "INSERT INTO orders (installed_by, serial_number,sold_date,discount,delievery_fees,total_price,status,cname,cphone,ccarman,ccarmodelname,ccarmodelyear,ccarplatenumber,delievery_time,is_delivered,order_status) VALUES ($1,$2,$3,$4,$5,$6,'Pending',$7,$8,$9,$10,$11,$12,$13,'No','ordered') RETURNING *;",
      [
        driverID,
        serial_number,
        date,
        discount,
        deliveryFees,
        totalPrice,
        name,
        phone,
        carMake,
        carModel,
        carYear,
        carPlate,
        time,
        // cAddress,
      ]
    );

    if (insertQue.rowCount > 0) {
      console.log("row inserted succesfully");
      console.log(insertQue.rows);
      res.status(200).json({ message: "row inserted succesfully" });
    } else {
      console.log("error inserting the row");
      res.status(404).json({
        message: "error inserting the row probably from your inserted data",
      });
    }
  } catch (err) {
    console.log("error inserting data " + err);
    res.status(500).json({ message: "catch error" });
  }
};

export default { inserOrder, getOrders };
