import { Router, type IRouter } from "express";
import { db, eventsTable, categoriesTable } from "@workspace/db";
import { eq, ilike, and, sql, or } from "drizzle-orm";

const router: IRouter = Router();

const EVENT_SELECT = {
  id: eventsTable.id,
  title: eventsTable.title,
  description: eventsTable.description,
  shortDescription: eventsTable.shortDescription,
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
  registrationUrl: eventsTable.registrationUrl,
  totalTickets: eventsTable.totalTickets,
  availableTickets: eventsTable.availableTickets,
  createdAt: eventsTable.createdAt,
};

function formatEvent(e: typeof EVENT_SELECT extends Record<string, any> ? any : any) {
  const isFull = e.totalTickets > 0 && e.availableTickets <= 0;
  return {
    ...e,
    categoryName: e.categoryName ?? "",
    createdAt: e.createdAt instanceof Date ? e.createdAt.toISOString() : e.createdAt,
    minPrice: null,
    maxPrice: null,
    attendeeCount: 0,
    isFull,
  };
}

router.get("/events/featured", async (req, res) => {
  try {
    const events = await db
      .select(EVENT_SELECT)
      .from(eventsTable)
      .leftJoin(categoriesTable, eq(eventsTable.categoryId, categoriesTable.id))
      .where(eq(eventsTable.isFeatured, true))
      .limit(8);

    res.json(events.map(formatEvent));
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
      .select(EVENT_SELECT)
      .from(eventsTable)
      .leftJoin(categoriesTable, eq(eventsTable.categoryId, categoriesTable.id))
      .where(eq(eventsTable.id, id));

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    res.json(formatEvent(event));
  } catch (err) {
    req.log.error({ err }, "Error getting event");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/events", async (req, res) => {
  const {
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

    if (isFree === "false") {
      conditions.push(eq(eventsTable.isFree, false));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(eventsTable)
      .where(whereClause);

    const events = await db
      .select(EVENT_SELECT)
      .from(eventsTable)
      .leftJoin(categoriesTable, eq(eventsTable.categoryId, categoriesTable.id))
      .where(whereClause)
      .orderBy(eventsTable.startDate)
      .limit(limitNum)
      .offset(offset);

    res.json({
      events: events.map(formatEvent),
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
      registrationUrl,
      maxCapacity,
    } = req.body;

    const capacity = maxCapacity ? Number(maxCapacity) : 0;

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
        registrationUrl: registrationUrl || null,
        totalTickets: capacity,
        availableTickets: capacity,
      })
      .returning();

    const [cat] = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, event.categoryId));

    res.status(201).json(formatEvent({ ...event, categoryName: cat?.name }));
  } catch (err) {
    req.log.error({ err }, "Error creating event");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
