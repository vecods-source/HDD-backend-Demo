export const check = (req, res) => {
  console.log("this is what we got: ", req.session);
  if (!req.session.userId) {
    console.log("Not logged in");
    return res.status(401).json({ message: "Not logged in", loggedIn: false });
  }
  console.log("Log in Good");
  res.status(200).json({
    loggedIn: true,
    userId: req.session.userId,
    userRole: req.session.role,
  });
};
