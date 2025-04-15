const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { authenticate } = require("./auth");

const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management endpoints
 */

router.use(authenticate); // ✅ Protect all routes

router.post("/newevent", async (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId;

  try {
    const event = await prisma.event.create({
      data: {
        name,
        userId,
      },
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to create event" });
  }
});

router.get("/getevent", async (req, res) => {
  const userId = req.user.userId;

  try {
    const events = await prisma.event.findMany({
      where: { userId },
      include: { gifts: true },
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

module.exports = { router };
