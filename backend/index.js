const express = require("express");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
const { router: giftRoutes } = require("./gift"); // Import the gift routes
const eventRoutes = require("./events") // Import the event routes
const { router: authRoutes } = require("./auth"); // Import the auth routes
const cors = require("cors");
const { swaggerUi, specs } = require("./swagger");

const prisma = new PrismaClient();
const app = express();


app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes.router);
app.use("/api", giftRoutes);
app.get("/", (req, res) => res.send("API is running"));
// Serve Swagger API documentation

  

//console.log(specs);


// Health check route

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Gift Management API Docs"
  }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
