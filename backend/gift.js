const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { authenticate } = require("./auth");

const prisma = new PrismaClient();

router.use(authenticate);

/**
 * POST /api/gifts - Create a new gift
 * Allow any user who is part of the event to create a gift
 */
router.post("/gifts", async (req, res) => {
  const { name, description, type, giftedBy, eventId } = req.body;
  const userId = req.user.userId;

  try {
    // Check if the event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if the user is part of the event (access validation)
    const membership = await prisma.eventUser.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({ error: "You do not have access to this event" });
    }

    // Create the new gift
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
    console.error(err);
    res.status(500).json({ error: "Failed to create gift" });
  }
});

/**
 * GET /api/gifts - Get all gifts for a specific event
 * Allow any user who has access to the event to view gifts
 */
router.get("/gifts", async (req, res) => {
  const userId = req.user.userId;
  const { eventId } = req.query;

  if (!eventId) {
    return res.status(400).json({ message: "Please provide an eventId" });
  }

  try {
    // Check if the user has access to the event
    const membership = await prisma.eventUser.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId: Number(eventId),
        },
      },
    });

    if (!membership) {
      return res.status(403).json({ error: "You do not have access to this event" });
    }

    // Fetch gifts for the event, regardless of user (shared gifts included)
    const gifts = await prisma.gift.findMany({
      where: {
        eventId: Number(eventId),
      },
      include: {
        user: true,  // Optionally include user info for each gift
      },
    });

    if (!gifts.length) {
      return res.status(404).json({ message: "No gifts found for the given eventId" });
    }

    res.json(gifts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch gifts" });
  }
});

/**
 * PUT /api/gifts/:id - Update a gift's details
 * Allow any user with access to the event to update the gift
 * We will allow users to update any gift in the event for now, but you can restrict it to their own gifts if needed.
 */
router.put("/gifts/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, type, giftedBy, isReceived } = req.body;
  const userId = req.user.userId;

  try {
    const gift = await prisma.gift.findUnique({
      where: { id: Number(id) },
    });

    if (!gift) {
      return res.status(404).json({ error: "Gift not found" });
    }

    // Check if the user is part of the event
    const membership = await prisma.eventUser.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId: gift.eventId,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({ error: "You do not have access to this event" });
    }

    const updatedGift = await prisma.gift.update({
      where: { id: Number(id) },
      data: { name, description, type, giftedBy, isReceived },
    });

    res.json(updatedGift);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update gift" });
  }
});

/**
 * DELETE /api/gifts/:id - Delete a gift
 * Allow any user with access to the event to delete a gift
 * You can restrict this to the gift creator or allow any user with event access.
 */
router.delete("/gifts/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const gift = await prisma.gift.findUnique({
      where: { id: Number(id) },
    });

    if (!gift) {
      return res.status(404).json({ error: "Gift not found" });
    }

    // Check if the user is part of the event
    const membership = await prisma.eventUser.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId: gift.eventId,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({ error: "You do not have access to this event" });
    }

    await prisma.gift.delete({ where: { id: Number(id) } });
    res.json({ message: "Gift deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete gift" });
  }
});

module.exports = { router };
