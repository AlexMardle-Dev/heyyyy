import { Router, type IRouter } from "express";
import { db, ticketsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/tickets", async (req, res) => {
  const eventIdRaw = req.query.eventId;
  if (!eventIdRaw) {
    res.status(400).json({ error: "eventId query param is required" });
    return;
  }
  const eventId = Number(eventIdRaw);
  if (isNaN(eventId)) {
    res.status(400).json({ error: "Invalid eventId" });
    return;
  }
  try {
    const tickets = await db
      .select()
      .from(ticketsTable)
      .where(eq(ticketsTable.eventId, eventId));
    res.json(
      tickets.map((t) => ({
        id: t.id,
        eventId: t.eventId,
        name: t.name,
        description: t.description,
        price: parseFloat(t.price),
        quantity: t.quantity,
        quantitySold: t.quantitySold,
        isFree: t.isFree,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Error listing tickets");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
