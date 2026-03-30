import { Router, type IRouter } from "express";
import { db, categoriesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { eventsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/categories", async (req, res) => {
  try {
    const categories = await db.select().from(categoriesTable);
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const [result] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(eventsTable)
          .where(eq(eventsTable.categoryId, cat.id));
        return {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
          eventCount: result?.count ?? 0,
        };
      })
    );
    res.json(categoriesWithCount);
  } catch (err) {
    req.log.error({ err }, "Error listing categories");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
