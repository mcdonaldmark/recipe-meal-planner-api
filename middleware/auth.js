module.exports = function ensureAuthenticated(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "You must log in via Google" });
  }
  next();
};
