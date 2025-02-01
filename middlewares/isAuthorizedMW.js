const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.session.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};

const isDriver = (req, res, next) => {
  if (req.session.role !== "driver") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};

export default { isAuthenticated, isAdmin, isDriver };
