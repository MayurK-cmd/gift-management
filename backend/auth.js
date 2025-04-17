const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn("Warning: JWT_SECRET is not set in the environment variables!");
}

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * path:
 *  /api/auth/signup:
 *    post:
 *      summary: Register a new user
 *      tags: [Auth]
 *      requestBody:
 *        description: User signup details
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: user@example.com
 *                fullname:
 *                  type: string
 *                  example: John Doe
 *                password:
 *                  type: string
 *                  example: strongpassword123
 *      responses:
 *        201:
 *          description: User created successfully
 *        400:
 *          description: Invalid input or email already exists
 */
router.post("/signup", async (req, res) => {
  const { email, fullname, password } = req.body;

  if (!email || !fullname || !password) {
    return res.status(400).json({ message: "Email, full name, and password are required" });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res.status(400).json({ message: "User with this email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, fullname, password: hashedPassword },
  });

  res.status(201).json({ message: "User created successfully", user: { email: user.email, fullname: user.fullname } });
});

/**
 * @swagger
 * path:
 *  /api/auth/login:
 *    post:
 *      summary: Login an existing user
 *      tags: [Auth]
 *      requestBody:
 *        description: User login credentials
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: user@example.com
 *                password:
 *                  type: string
 *                  example: strongpassword123
 *      responses:
 *        200:
 *          description: Login successful, returns JWT token
 *        400:
 *          description: Invalid credentials
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

  res.json({ message: "Login successful", token });
});

// Middleware for Authentication
const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Access Denied. No token." });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    res.status(401).json({ message: "Invalid Token" });
  }
};



module.exports = {
  router,
  authenticate,
};
