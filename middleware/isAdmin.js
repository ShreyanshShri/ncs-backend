const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const isAdmin = (req, res, next) => {
	const token = req.header("Authorization")?.replace("Bearer ", ""); // Extract token from Authorization header
	if (!token) {
		return res.status(401).json({
			message: "Unauthorized. No token provided.",
		});
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		if (decoded.type !== "admin") {
			return res.status(403).json({
				message: "Forbidden",
			});
		}
		next();
	} catch (error) {
		return res.status(401).json({
			message: "Unauthorized",
		});
	}
};

module.exports = isAdmin;
