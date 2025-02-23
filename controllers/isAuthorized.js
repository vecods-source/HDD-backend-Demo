import bcrypt from "bcrypt";
import pool from "../config/dp.js";

// REGISTER
const register = async (req, res) => {
  const { name, username, password, role, phonenumber, email } = req.body;
  console.log(username, password, role);
  if (!["admin", "driver"].includes(role))
    return res.status(400).json({ error: "Invalid role" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `INSERT INTO ${role}s (username, password,phonenumber,email, name) VALUES ($1, $2, $3, $4, $5) RETURNING ${role}_id`;

  try {
    const result = await pool.query(query, [
      username,
      hashedPassword,
      phonenumber,
      email,
      name,
    ]);
    res.status(201).json({
      message: "User registered!",
      userId: result.rows[0].id,
    });
    console.log("User registered!");
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  const { username, password, role } = req.body;
  console.log("hello world this the the username: ", username);
  console.log("this is what we got: ", req.body);

  try {
    const userData = await pool.query(
      `SELECT password, ${role}_id From ${role}s WHERE username = $1`,
      [username]
    );
    if (userData.rowCount > 0) {
      const userID = userData.rows[0][`${role}_id`];
      const validPassword = await bcrypt.compare(
        password,
        userData.rows[0].password
      );

      if (!validPassword) {
        console.log("invalid credentials");
        return res.status(401).json({ mesage: "Invalid credentials" });
      }
      req.session.userId = userID;
      req.session.role = role;
      console.log("this is what we got from sessions: ", req.session);

      res.json({
        message: "Login successful",
        userId: req.session.userId,
        userRole: req.session.role,
      });
      console.log("logged in successfully");
    } else {
      console.log("no user with the given Credential found");
      res.json({
        message: "Login faild",
        userId: null,
        userRole: null,
      });
    }
  } catch (err) {
    console.log("error cathing: ", err.message);
    res.json({
      message: "fetch user data faild",
    });
  }
};

// LOGOUT
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.clearCookie("connect.sid"); // Clear session cookie
    res.json({ message: "Logged out successfully" });
  });
};

export default { register, login, logout };
