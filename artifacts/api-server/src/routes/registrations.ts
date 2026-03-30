import { Router, type IRouter } from "express";
import { db, registrationsTable, ticketsTable, eventsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateRegistrationBody } from "@workspace/api-zod";

const router: IRouter = Router();

function generateConfirmationCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

router.get("/registrations", async (req, res) => {
  try {
    const registrations = await db
      .select({
        id: registrationsTable.id,
        eventId: registrationsTable.eventId,
        eventTitle: eventsTable.title,
        ticketId: registrationsTable.ticketId,
        ticketName: ticketsTable.name,
        attendeeName: registrationsTable.attendeeName,
        attendeeEmail: registrationsTable.attendeeEmail,
        quantity: registrationsTable.quantity,
        totalAmount: registrationsTable.totalAmount,
        status: registrationsTable.status,
        confirmationCode: registrationsTable.confirmationCode,
        createdAt: registrationsTable.createdAt,
      })
      .from(registrationsTable)
      .leftJoin(eventsTable, eq(registrationsTable.eventId, eventsTable.id))
      .leftJoin(ticketsTable, eq(registrationsTable.ticketId, ticketsTable.id));

    res.json(
      registrations.map((r) => ({
        ...r,
        totalAmount: parseFloat(r.totalAmount),
        createdAt: r.createdAt?.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Error listing registrations");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/registrations", async (req, res) => {
  const parsed = CreateRegistrationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const { eventId, ticketId, attendeeName, attendeeEmail, quantity } = parsed.data;
  try {
    const [ticket] = await db
      .select()
      .from(ticketsTable)
      .where(eq(ticketsTable.id, ticketId));
    if (!ticket) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }
    const available = ticket.quantity - ticket.quantitySold;
    if (quantity > available) {
      res.status(400).json({ error: "Not enough tickets available" });
      return;
    }
    const totalAmount = parseFloat(ticket.price) * quantity;
    const confirmationCode = generateConfirmationCode();

    const [registration] = await db
      .insert(registrationsTable)
      .values({
        eventId,
        ticketId,
        attendeeName,
        attendeeEmail,
        quantity,
        totalAmount: totalAmount.toFixed(2),
        status: "confirmed",
        confirmationCode,
      })
      .returning();

    await db
      .update(ticketsTable)
      .set({ quantitySold: ticket.quantitySold + quantity })
      .where(eq(ticketsTable.id, ticketId));

    await db
      .update(eventsTable)
      .set({ attendeeCount: eventsTable.attendeeCount })
      .where(eq(eventsTable.id, eventId));

    const [event] = await db
      .select({ title: eventsTable.title })
      .from(eventsTable)
      .where(eq(eventsTable.id, eventId));

    res.status(201).json({
      id: registration.id,
      eventId: registration.eventId,
      eventTitle: event?.title ?? "",
      ticketId: registration.ticketId,
      ticketName: ticket.name,
      attendeeName: registration.attendeeName,
      attendeeEmail: registration.attendeeEmail,
      quantity: registration.quantity,
      totalAmount,
      status: registration.status,
      confirmationCode: registration.confirmationCode,
      createdAt: registration.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error creating registration");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
