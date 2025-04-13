const express = require("express");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
const giftRoutes = require("./gift");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use("/api", giftRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
