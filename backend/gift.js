const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { authenticate } = require("./auth"); // ✅ Use shared auth middleware

const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: Gifts
 *   description: Gift management endpoints
 */

router.use(authenticate); // ✅ Apply middleware here

router.post("/gifts", async (req, res) => {
  const { name, description, type, giftedBy, eventId } = req.body;
  const userId = req.user.userId;

  try {
    const event = await prisma.event.findFirst({
      where: { id: eventId, userId },
    });

    if (!event) {
      return res.status(403).json({ error: "Invalid event or not owned by user" });
    }

    const gift = await prisma.gift.create({
      data: {
        name,
        description,
        type,
        giftedBy,
        userId,
        eventId,
      },
    });

    res.status(201).json(gift);
  } catch (err) {
    res.status(500).json({ error: "Failed to create gift" });
  }
});

// GET /api/gifts
router.get("/gifts", async (req, res) => {
  const userId = req.user.userId; // Get the logged-in user's ID
  const { eventId } = req.query;  // Get the eventId from the query string

  if (!eventId) {
    return res.status(400).json({ message: "Please provide an eventId" });
  }

  try {
    // If eventId is provided, filter gifts by that event
    const gifts = await prisma.gift.findMany({
      where: {
        userId,
        eventId: Number(eventId),  // Ensure the eventId is converted to a number
      },
      include: {
        event: true,  // Include event details with the gift
      },
    });

    if (!gifts || gifts.length === 0) {
      return res.status(404).json({ message: "No gifts found for the given eventId" });
    }

    res.json(gifts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch gifts" });
  }
});



router.put("/gifts/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, type, giftedBy, isReceived } = req.body;
  const userId = req.user.userId;

  try {
    const gift = await prisma.gift.findUnique({
      where: { id: Number(id) },
    });

    if (!gift || gift.userId !== userId) {
      return res.status(403).json({ error: "Gift not found or not owned by you" });
    }

    const updated = await prisma.gift.update({
      where: { id: Number(id) },
      data: { name, description, type, giftedBy, isReceived },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update gift" });
  }
});

router.delete("/gifts/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const gift = await prisma.gift.findUnique({
      where: { id: Number(id) },
    });

    if (!gift || gift.userId !== userId) {
      return res.status(403).json({ error: "Gift not found or not owned by you" });
    }

    await prisma.gift.delete({ where: { id: Number(id) } });
    res.json({ message: "Gift deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete gift" });
  }
});

module.exports = { router };
