export const check = (req, res) => {
  console.log(req.session);
  if (!req.session.userId) {
    console.log("Not logged in");
    return res.status(401).json({ message: "Not logged in", loggedIn: false });
  }

  res.status(200).json({
    loggedIn: true,
    userId: req.session.userId,
    userRole: req.session.role,
  });
};
