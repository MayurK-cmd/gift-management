const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { authenticate } = require("./auth");

const prisma = new PrismaClient();

// --- Apply authenticate middleware here ---
router.post("/newevent", authenticate, async (req, res) => {
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
    console.error("Failed to create event:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
});

router.get("/getevent", authenticate, async (req, res) => {
  const userId = req.user.userId;

  try {
    const events = await prisma.event.findMany({
      where: { userId },
      include: { gifts: true },
    });
    res.json(events);
  } catch (err) {
    console.error("Failed to fetch events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

module.exports = { router };
