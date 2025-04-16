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

/**
 * @swagger
 * path:
 *  /api/gifts:
 *    post:
 *      summary: Create a new gift
 *      tags: [Gifts]
 *      security:
 *        - BearerAuth: []  # Authentication required
 *      requestBody:
 *        description: Details of the gift to be created
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: "Gift Card"
 *                description:
 *                  type: string
 *                  example: "A $50 gift card for the store"
 *                type:
 *                  type: string
 *                  example: "Physical"
 *                giftedBy:
 *                  type: string
 *                  example: "John Doe"
 *                eventId:
 *                  type: integer
 *                  example: 1
 *      responses:
 *        201:
 *          description: Gift created successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                    example: 1
 *                  name:
 *                    type: string
 *                    example: "Gift Card"
 *                  description:
 *                    type: string
 *                    example: "A $50 gift card for the store"
 *                  type:
 *                    type: string
 *                    example: "Physical"
 *                  giftedBy:
 *                    type: string
 *                    example: "John Doe"
 *                  eventId:
 *                    type: integer
 *                    example: 1
 *        403:
 *          description: Invalid event or not owned by the user
 *        500:
 *          description: Failed to create gift
 */
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

/**
 * @swagger
 * path:
 *  /api/gifts:
 *    get:
 *      summary: Get all gifts for a specific event
 *      tags: [Gifts]
 *      security:
 *        - BearerAuth: []  # Authentication required
 *      parameters:
 *        - in: query
 *          name: eventId
 *          required: true
 *          description: The ID of the event to fetch gifts for
 *          schema:
 *            type: integer
 *            example: 1
 *      responses:
 *        200:
 *          description: List of gifts for the given eventId
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: integer
 *                      example: 1
 *                    name:
 *                      type: string
 *                      example: "Gift Card"
 *                    description:
 *                      type: string
 *                      example: "A $50 gift card for the store"
 *                    type:
 *                      type: string
 *                      example: "Physical"
 *                    giftedBy:
 *                      type: string
 *                      example: "John Doe"
 *                    eventId:
 *                      type: integer
 *                      example: 1
 *        400:
 *          description: Missing eventId query parameter
 *        404:
 *          description: No gifts found for the given eventId
 *        500:
 *          description: Failed to fetch gifts
 */
router.get("/gifts", async (req, res) => {
  const userId = req.user.userId; // Get the logged-in user's ID
  const { eventId } = req.query;  // Get the eventId from the query string

  if (!eventId) {
    return res.status(400).json({ message: "Please provide an eventId" });
  }

  try {
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

/**
 * @swagger
 * path:
 *  /api/gifts/{id}:
 *    put:
 *      summary: Update a gift's details
 *      tags: [Gifts]
 *      security:
 *        - BearerAuth: []  # Authentication required
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the gift to update
 *          schema:
 *            type: integer
 *            example: 1
 *      requestBody:
 *        description: The updated gift details
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: "Updated Gift Card"
 *                description:
 *                  type: string
 *                  example: "A $100 gift card for the store"
 *                type:
 *                  type: string
 *                  example: "Virtual"
 *                giftedBy:
 *                  type: string
 *                  example: "Jane Doe"
 *                isReceived:
 *                  type: boolean
 *                  example: true
 *      responses:
 *        200:
 *          description: Gift updated successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                    example: 1
 *                  name:
 *                    type: string
 *                    example: "Updated Gift Card"
 *                  description:
 *                    type: string
 *                    example: "A $100 gift card for the store"
 *                  type:
 *                    type: string
 *                    example: "Virtual"
 *                  giftedBy:
 *                    type: string
 *                    example: "Jane Doe"
 *                  isReceived:
 *                    type: boolean
 *                    example: true
 *        403:
 *          description: Gift not found or not owned by user
 *        500:
 *          description: Failed to update gift
 */
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

/**
 * @swagger
 * path:
 *  /api/gifts/{id}:
 *    delete:
 *      summary: Delete a gift
 *      tags: [Gifts]
 *      security:
 *        - BearerAuth: []  # Authentication required
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the gift to delete
 *          schema:
 *            type: integer
 *            example: 1
 *      responses:
 *        200:
 *          description: Gift deleted successfully
 *        403:
 *          description: Gift not found or not owned by user
 *        500:
 *          description: Failed to delete gift
 */
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
