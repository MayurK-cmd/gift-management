const express = require("express");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
const {router: giftRoutes} = require("./gift"); // Import the gift routes
const {router: eventRoutes} = require("./events"); // Import the event routes
const { router: authRoutes, authenticate } = require("./auth"); // Import the auth middleware
const cors = require("cors");
const { swaggerUi, specs } = require("./swagger");


const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => res.send("API is running"));
 // Enable CORS for all routes
 app.use("/api", eventRoutes);
app.use("/api", giftRoutes);
 // Use the event routes
 // Use the auth routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));


const PORT = process.env.PORT || 3000;
//console.log(require('crypto').randomBytes(32).toString('hex'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
