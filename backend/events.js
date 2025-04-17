const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { authenticate } = require("./auth");

const prisma = new PrismaClient();

// --- POST /newevent ---
router.post("/newevent", authenticate, async (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId;

  try {
    const event = await prisma.event.create({
      data: {
        name,
        user: {
          connect: { id: userId },
        },
        sharedWith: {
          create: {
            userId,
          },
        },
      },
    });

    res.status(201).json(event);
  } catch (err) {
    console.error("Failed to create event:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// --- POST /shareevent ---
router.post("/shareevent", authenticate, async (req, res) => {
  const { eventId, email } = req.body;
  const userId = req.user.userId;

  try {
    // Check if requester is a member of the event
    const membership = await prisma.eventUser.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });

    if (!membership) {
      return res.status(403).json({ message: "You don't have access to this event" });
    }

    const userToShare = await prisma.user.findUnique({ where: { email } });
    if (!userToShare) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userToShare.id === userId) {
      return res.status(400).json({ message: "You already have access to this event" });
    }

    const existing = await prisma.eventUser.findUnique({
      where: { userId_eventId: { userId: userToShare.id, eventId } },
    });

    if (existing) {
      return res.status(400).json({ message: "Event already shared with this user" });
    }

    await prisma.eventUser.create({
      data: {
        userId: userToShare.id,
        eventId,
      },
    });

    res.json({ message: "Event shared successfully" });
  } catch (err) {
    console.error("Error sharing event:", err);
    res.status(500).json({ error: "Could not share event" });
  }
});


// --- GET /getevent ---
router.get("/getevent", authenticate, async (req, res) => {
  const userId = req.user.userId;

  try {
    const events = await prisma.event.findMany({
      where: {
        userId: userId, // Only fetch events created by the user
      },
      include: {
        gifts: true, // Optionally include gifts for each event
        user: true,  // Include event creator info
      },
    });

    res.json(events);
  } catch (err) {
    console.error("Failed to fetch events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// --- GET /getSharedEvents ---
router.get("/getSharedEvents", authenticate, async (req, res) => {
  const userId = req.user.userId;

  try {
    // Fetch events that are shared with the user (check the 'sharedWith' relation)
    const sharedEvents = await prisma.event.findMany({
      where: {
        sharedWith: {
          some: {
            userId: userId, // The user should be in the 'sharedWith' relation
          },
        },
      },
      include: {
        gifts: true, // Include gifts if needed
        sharedWith: { // Include the users related to the shared event
          include: {
            user: true, // Include user details from the sharedWith relation
          },
        },
      },
    });

    // Respond with the shared events
    res.json(sharedEvents);
  } catch (err) {
    console.error("Error fetching shared events:", err);
    res.status(500).json({ error: "Failed to fetch shared events" });
  }
});


module.exports = { router };
