const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
	try {
		// Get the token from the Authorization header
		const token = req.header("Authorization")?.replace("Bearer ", "");
		if (!token) {
			return res
				.status(401)
				.json({ error: "Access denied. No token provided." });
		}

		// Verify the token using the secret key from the environment variables
		const secretKey = process.env.JWT_SECRET;
		if (!secretKey) {
			return res
				.status(500)
				.json({ error: "Internal server error. Missing secret key." });
		}

		const decoded = jwt.verify(token, secretKey);

		// Attach the user ID to the request object
		req.user = decoded;

		// Proceed to the next middleware or route handler
		next();
	} catch (error) {
		console.error("Authentication error:", error);
		res.status(401).json({ error: "Invalid token." });
	}
};

module.exports = authenticate;
