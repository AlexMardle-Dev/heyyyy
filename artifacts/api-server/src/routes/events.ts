import { Router, type IRouter } from "express";
import { db, eventsTable, categoriesTable, ticketsTable } from "@workspace/db";
import { eq, ilike, and, sql, or, min, inArray } from "drizzle-orm";

async function getMinPrice(eventId: number): Promise<number | null> {
  const [row] = await db
    .select({ minPrice: min(ticketsTable.price) })
    .from(ticketsTable)
    .where(eq(ticketsTable.eventId, eventId));
  return row?.minPrice ? parseFloat(row.minPrice) : null;
}

const router: IRouter = Router();

router.get("/events/featured", async (req, res) => {
  try {
    const events = await db
      .select({
        id: eventsTable.id,
        title: eventsTable.title,
        description: eventsTable.description,
        shortDescription: eventsTable.shortDescription,
        imageUrl: eventsTable.imageUrl,
        startDate: eventsTable.startDate,
        endDate: eventsTable.endDate,
        location: eventsTable.location,
        venue: eventsTable.venue,
        city: eventsTable.city,
        state: eventsTable.state,
        isOnline: eventsTable.isOnline,
        isFeatured: eventsTable.isFeatured,
        isFree: eventsTable.isFree,
        categoryId: eventsTable.categoryId,
        categoryName: categoriesTable.name,
        organizerName: eventsTable.organizerName,
        attendeeCount: eventsTable.attendeeCount,
        totalTickets: eventsTable.totalTickets,
        availableTickets: eventsTable.availableTickets,
        createdAt: eventsTable.createdAt,
      })
      .from(eventsTable)
      .leftJoin(categoriesTable, eq(eventsTable.categoryId, categoriesTable.id))
      .where(eq(eventsTable.isFeatured, true))
      .limit(8);

    const eventIds = events.map((e) => e.id);
    const priceRows = eventIds.length > 0 ? await db
      .select({ eventId: ticketsTable.eventId, minPrice: min(ticketsTable.price) })
      .from(ticketsTable)
      .where(inArray(ticketsTable.eventId, eventIds))
      .groupBy(ticketsTable.eventId) : [];
    const priceMap = Object.fromEntries(priceRows.map(r => [r.eventId, r.minPrice ? parseFloat(r.minPrice) : null]));

    res.json(
      events.map((e) => ({
        ...e,
        categoryName: e.categoryName ?? "",
        createdAt: e.createdAt.toISOString(),
        minPrice: priceMap[e.id] ?? null,
        maxPrice: priceMap[e.id] ?? null,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Error getting featured events");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/events/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid event id" });
    return;
  }
  try {
    const [event] = await db
      .select({
        id: eventsTable.id,
        title: eventsTable.title,
        description: eventsTable.description,
        shortDescription: eventsTable.shortDescription,
        imageUrl: eventsTable.imageUrl,
        startDate: eventsTable.startDate,
        endDate: eventsTable.endDate,
        location: eventsTable.location,
        venue: eventsTable.venue,
        city: eventsTable.city,
        state: eventsTable.state,
        isOnline: eventsTable.isOnline,
        isFeatured: eventsTable.isFeatured,
        isFree: eventsTable.isFree,
        categoryId: eventsTable.categoryId,
        categoryName: categoriesTable.name,
        organizerName: eventsTable.organizerName,
        attendeeCount: eventsTable.attendeeCount,
        totalTickets: eventsTable.totalTickets,
        availableTickets: eventsTable.availableTickets,
        createdAt: eventsTable.createdAt,
      })
      .from(eventsTable)
      .leftJoin(categoriesTable, eq(eventsTable.categoryId, categoriesTable.id))
      .where(eq(eventsTable.id, id));

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    const minPrice = await getMinPrice(event.id);
    res.json({
      ...event,
      categoryName: event.categoryName ?? "",
      createdAt: event.createdAt.toISOString(),
      minPrice,
      maxPrice: minPrice,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting event");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/events", async (req, res) => {
  const {
    category,
    search,
    location,
    isFree,
    page = "1",
    limit = "12",
  } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12));
  const offset = (pageNum - 1) * limitNum;

  try {
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(eventsTable.title, `%${search}%`),
          ilike(eventsTable.description, `%${search}%`),
          ilike(eventsTable.city, `%${search}%`)
        )
      );
    }

    if (location) {
      conditions.push(
        or(
          ilike(eventsTable.city, `%${location}%`),
          ilike(eventsTable.location, `%${location}%`)
        )
      );
    }

    if (isFree === "true") {
      conditions.push(eq(eventsTable.isFree, true));
    }

    if (category) {
      const [cat] = await db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.slug, category));
      if (cat) {
        conditions.push(eq(eventsTable.categoryId, cat.id));
      }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(eventsTable)
      .where(whereClause);

    const events = await db
      .select({
        id: eventsTable.id,
        title: eventsTable.title,
        description: eventsTable.description,
        shortDescription: eventsTable.shortDescription,
        imageUrl: eventsTable.imageUrl,
        startDate: eventsTable.startDate,
        endDate: eventsTable.endDate,
        location: eventsTable.location,
        venue: eventsTable.venue,
        city: eventsTable.city,
        state: eventsTable.state,
        isOnline: eventsTable.isOnline,
        isFeatured: eventsTable.isFeatured,
        isFree: eventsTable.isFree,
        categoryId: eventsTable.categoryId,
        categoryName: categoriesTable.name,
        organizerName: eventsTable.organizerName,
        attendeeCount: eventsTable.attendeeCount,
        totalTickets: eventsTable.totalTickets,
        availableTickets: eventsTable.availableTickets,
        createdAt: eventsTable.createdAt,
      })
      .from(eventsTable)
      .leftJoin(categoriesTable, eq(eventsTable.categoryId, categoriesTable.id))
      .where(whereClause)
      .limit(limitNum)
      .offset(offset);

    const eventIds = events.map((e) => e.id);
    const priceRows2 = eventIds.length > 0 ? await db
      .select({ eventId: ticketsTable.eventId, minPrice: min(ticketsTable.price) })
      .from(ticketsTable)
      .where(inArray(ticketsTable.eventId, eventIds))
      .groupBy(ticketsTable.eventId) : [];
    const priceMap2 = Object.fromEntries(priceRows2.map(r => [r.eventId, r.minPrice ? parseFloat(r.minPrice) : null]));

    res.json({
      events: events.map((e) => ({
        ...e,
        categoryName: e.categoryName ?? "",
        createdAt: e.createdAt.toISOString(),
        minPrice: priceMap2[e.id] ?? null,
        maxPrice: priceMap2[e.id] ?? null,
      })),
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    req.log.error({ err }, "Error listing events");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/events", async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      startDate,
      endDate,
      location,
      venue,
      city,
      state,
      isOnline,
      isFree,
      categoryId,
      organizerName,
      ticketName,
      ticketPrice,
      ticketQuantity,
    } = req.body;

    const quantity = Number(ticketQuantity) || 100;
    const price = isFree ? 0 : (Number(ticketPrice) || 0);

    const [event] = await db
      .insert(eventsTable)
      .values({
        title,
        description,
        shortDescription,
        imageUrl: null,
        startDate,
        endDate,
        location: location || "",
        venue: venue || "",
        city: city || "",
        state: state || "",
        isOnline: Boolean(isOnline),
        isFree: Boolean(isFree),
        categoryId: Number(categoryId),
        organizerName,
        totalTickets: quantity,
        availableTickets: quantity,
      })
      .returning();

    await db.insert(ticketsTable).values({
      eventId: event.id,
      name: ticketName || "General Admission",
      price: String(price),
      quantity: quantity,
      isFree: Boolean(isFree),
      description: null,
    });

    const [cat] = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, event.categoryId));

    res.status(201).json({
      ...event,
      categoryName: cat?.name ?? "",
      createdAt: event.createdAt.toISOString(),
      minPrice: price,
      maxPrice: price,
    });
  } catch (err) {
    req.log.error({ err }, "Error creating event");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
