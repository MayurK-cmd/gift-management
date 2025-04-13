const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Create gift
router.post("/gifts", async (req, res) => {
  const { name, description, type, giftedBy } = req.body;
  try {
    const gift = await prisma.gift.create({
      data: { name, description, type, giftedBy },
    });
    res.json(gift);
  } catch (error) {
    res.status(500).json({ error: "Failed to create gift" });
  }
});

// Get all gifts
router.get("/gifts", async (req, res) => {
  try {
    const gifts = await prisma.gift.findMany();
    res.json(gifts);
  } catch {
    res.status(500).json({ error: "Failed to fetch gifts" });
  }
});

// Update gift
router.put("/gifts/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, type, giftedBy, isReceived } = req.body;
  try {
    const gift = await prisma.gift.update({
      where: { id: Number(id) },
      data: { name, description, type, giftedBy, isReceived },
    });
    res.json(gift);
  } catch {
    res.status(404).json({ error: "Gift not found" });
  }
});

// Delete gift
router.delete("/gifts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.gift.delete({ where: { id: Number(id) } });
    res.json({ message: "Gift deleted" });
  } catch {
    res.status(404).json({ error: "Gift not found" });
  }
});

module.exports = router;
