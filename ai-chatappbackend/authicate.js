import jwt from "jsonwebtoken"

const authenticate = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]
    if (!token) {
        res.status(401).json({ error: "Access Denied, invalid token" })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        res.status(403).json({ error: "Invalid or Expired token" })
    }
}