import { db, categoriesTable, eventsTable, ticketsTable, registrationsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const categories = [
  { name: "Professional Meetup", slug: "professional", icon: "💼" },
  { name: "Conference", slug: "conferences", icon: "🎤" },
  { name: "Startup & Entrepreneurship", slug: "startup", icon: "🚀" },
  { name: "Technology", slug: "technology", icon: "💻" },
  { name: "Alumni Network", slug: "alumni", icon: "🎓" },
  { name: "Virtual Networking", slug: "virtual", icon: "🌐" },
  { name: "Coffee Chats", slug: "coffee", icon: "☕" },
  { name: "Industry Mixer", slug: "mixer", icon: "🤝" },
  { name: "Workshop & Training", slug: "workshop", icon: "🛠️" },
  { name: "Women in Business", slug: "women", icon: "💡" },
];

const events = [
  {
    title: "SF Founders & Investors Mixer",
    shortDescription: "An exclusive evening connecting early-stage founders with active angel investors and VCs in San Francisco.",
    description: "Join us for an intimate evening designed for meaningful conversations between founders and investors. This curated mixer limits attendance to 80 professionals, ensuring every person you meet is worth knowing. Expect lightning pitches, open networking, and a panel Q&A on the current funding climate. Drinks and light bites provided. Bring your business cards and genuine curiosity.",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format",
    startDate: "2026-04-18T18:00:00Z",
    endDate: "2026-04-18T21:30:00Z",
    location: "The Battery, San Francisco, CA",
    venue: "The Battery",
    city: "San Francisco",
    state: "CA",
    isOnline: false,
    isFeatured: true,
    isFree: false,
    slug: "startup",
    organizerName: "Bay Area Founders Circle",
    attendeeCount: 62,
    totalTickets: 80,
    availableTickets: 18,
  },
  {
    title: "Tech Leaders Summit 2026",
    shortDescription: "A full-day conference for CTOs, engineering managers, and senior developers shaping the future of tech.",
    description: "Tech Leaders Summit brings together the brightest engineering minds for a day of keynotes, deep-dive sessions, and peer networking. Topics include AI-native product development, scaling engineering orgs, platform engineering, and developer experience. Connect with peers who understand the complexity of building at scale.",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format",
    startDate: "2026-05-12T08:30:00Z",
    endDate: "2026-05-12T18:00:00Z",
    location: "Marriott Marquis, New York, NY",
    venue: "Marriott Marquis",
    city: "New York",
    state: "NY",
    isOnline: false,
    isFeatured: true,
    isFree: false,
    slug: "conferences",
    organizerName: "TechLeaders Group",
    attendeeCount: 840,
    totalTickets: 1200,
    availableTickets: 360,
  },
  {
    title: "Women in Finance Network Breakfast",
    shortDescription: "A power breakfast for women building careers in finance, banking, and investment.",
    description: "Start your week with purpose at our monthly Women in Finance breakfast. Network with senior professionals, analysts, and rising stars in the finance world over a catered breakfast. Each event features a guest speaker sharing insights on career advancement, negotiation, and leadership in a male-dominated industry.",
    imageUrl: "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=800&auto=format",
    startDate: "2026-04-21T07:30:00Z",
    endDate: "2026-04-21T09:30:00Z",
    location: "The Langham Hotel, Chicago, IL",
    venue: "The Langham Hotel",
    city: "Chicago",
    state: "IL",
    isOnline: false,
    isFeatured: true,
    isFree: false,
    slug: "women",
    organizerName: "Women in Finance Network",
    attendeeCount: 48,
    totalTickets: 60,
    availableTickets: 12,
  },
  {
    title: "Global Remote Work Networking Hour",
    shortDescription: "A virtual speed-networking event for remote workers, digital nomads, and distributed teams.",
    description: "Work from anywhere, connect from everywhere. Our monthly virtual networking hour pairs you with five other professionals in 8-minute one-on-one video chats. Then joins a group roundtable on topics like asynchronous collaboration, building remote culture, and freelancing internationally. No commute required.",
    imageUrl: "https://images.unsplash.com/photo-1591115765373-5207764f72e4?w=800&auto=format",
    startDate: "2026-04-25T17:00:00Z",
    endDate: "2026-04-25T19:00:00Z",
    location: "Online",
    venue: "Zoom",
    city: "Online",
    state: null,
    isOnline: true,
    isFeatured: false,
    isFree: true,
    slug: "virtual",
    organizerName: "Remote First Community",
    attendeeCount: 230,
    totalTickets: 500,
    availableTickets: 270,
  },
  {
    title: "Product & Design Happy Hour — Austin",
    shortDescription: "Monthly casual mixer for PMs, UX designers, and product leaders in the Austin tech scene.",
    description: "Grab a drink and swap war stories with fellow product and design professionals. This is a low-pressure, no-badge networking event where conversations flow naturally. Whether you're a startup PM, an in-house designer, or a consultant, you'll find your tribe here. Hosted at a rotating Austin venue every month.",
    imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format",
    startDate: "2026-04-30T18:30:00Z",
    endDate: "2026-04-30T21:00:00Z",
    location: "Cosmic Coffee + Beer Garden, Austin, TX",
    venue: "Cosmic Coffee + Beer Garden",
    city: "Austin",
    state: "TX",
    isOnline: false,
    isFeatured: false,
    isFree: true,
    slug: "mixer",
    organizerName: "ATX Product Collective",
    attendeeCount: 95,
    totalTickets: 150,
    availableTickets: 55,
  },
  {
    title: "AI & Machine Learning Professionals Meetup",
    shortDescription: "Networking and talks for ML engineers, data scientists, and AI researchers.",
    description: "Dive deep into the world of artificial intelligence with this monthly meetup for practitioners. Two lightning talks from engineers at leading AI companies are followed by open networking. Topics rotate each month: LLMs, computer vision, MLOps, responsible AI, and more. Hosted at various Seattle tech companies.",
    imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format",
    startDate: "2026-05-06T18:00:00Z",
    endDate: "2026-05-06T20:30:00Z",
    location: "Amazon HQ2, Seattle, WA",
    venue: "Amazon HQ2 Community Space",
    city: "Seattle",
    state: "WA",
    isOnline: false,
    isFeatured: true,
    isFree: false,
    slug: "technology",
    organizerName: "Seattle ML Guild",
    attendeeCount: 180,
    totalTickets: 250,
    availableTickets: 70,
  },
  {
    title: "Harvard Business School Alumni Speed Networking",
    shortDescription: "A structured speed-networking event exclusively for HBS alumni across all graduating classes.",
    description: "Reconnect with fellow alumni and expand your network with this structured speed-networking event. Each round pairs you with an alumnus from a different industry and graduation year. Come prepared with your 60-second intro, current projects, and what you're looking for — collaboration, talent, funding, or just great conversation.",
    imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format",
    startDate: "2026-05-20T17:00:00Z",
    endDate: "2026-05-20T19:30:00Z",
    location: "The Harvard Club, New York, NY",
    venue: "The Harvard Club",
    city: "New York",
    state: "NY",
    isOnline: false,
    isFeatured: false,
    isFree: false,
    slug: "alumni",
    organizerName: "HBS Alumni Association NYC",
    attendeeCount: 120,
    totalTickets: 160,
    availableTickets: 40,
  },
  {
    title: "Morning Coffee Chat: Healthcare Innovation",
    shortDescription: "Informal coffee networking for professionals working in health tech, biotech, and hospital systems.",
    description: "Join us for an unhurried morning coffee with fellow healthcare innovators. This small-group format (max 25 attendees) ensures you leave with real conversations, not just exchanged cards. Ideal for doctors exploring tech, health startup founders, hospital administrators, and digital health investors.",
    imageUrl: "https://images.unsplash.com/photo-1453847668862-487637052f8a?w=800&auto=format",
    startDate: "2026-04-22T08:00:00Z",
    endDate: "2026-04-22T10:00:00Z",
    location: "Blue Bottle Coffee, Boston, MA",
    venue: "Blue Bottle Coffee Beacon Hill",
    city: "Boston",
    state: "MA",
    isOnline: false,
    isFeatured: false,
    isFree: true,
    slug: "coffee",
    organizerName: "Health Innovators Network",
    attendeeCount: 18,
    totalTickets: 25,
    availableTickets: 7,
  },
  {
    title: "Negotiation Masterclass for Professionals",
    shortDescription: "A hands-on workshop on salary negotiation, deal-making, and high-stakes communication.",
    description: "Led by a former FBI hostage negotiator, this workshop teaches evidence-backed negotiation tactics you can apply immediately — whether you're negotiating a raise, a vendor contract, or a startup acquisition. Includes role-play exercises, peer feedback, and a private LinkedIn group for continued learning.",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format",
    startDate: "2026-05-09T09:00:00Z",
    endDate: "2026-05-09T16:00:00Z",
    location: "WeWork, Los Angeles, CA",
    venue: "WeWork Century City",
    city: "Los Angeles",
    state: "CA",
    isOnline: false,
    isFeatured: false,
    isFree: false,
    slug: "workshop",
    organizerName: "Peak Performance Institute",
    attendeeCount: 45,
    totalTickets: 60,
    availableTickets: 15,
  },
  {
    title: "Startup Founders Virtual Roundtable",
    shortDescription: "Monthly Zoom roundtable where early-stage founders share challenges, wins, and advice.",
    description: "A judgment-free zone for founders to be honest about what's working and what isn't. Each month, 12 founders join a moderated roundtable to discuss one specific challenge: hiring, fundraising, churn, co-founder conflict, and more. Applications reviewed to ensure a curated, relevant group.",
    imageUrl: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=800&auto=format",
    startDate: "2026-05-01T19:00:00Z",
    endDate: "2026-05-01T20:30:00Z",
    location: "Online",
    venue: "Zoom",
    city: "Online",
    state: null,
    isOnline: true,
    isFeatured: true,
    isFree: true,
    slug: "startup",
    organizerName: "IAN Founders Circle",
    attendeeCount: 11,
    totalTickets: 12,
    availableTickets: 1,
  },
  {
    title: "The Black Professionals Network Annual Gala",
    shortDescription: "An elegant evening celebrating achievement and community for Black professionals across all industries.",
    description: "The BPN Annual Gala is the premier professional networking event of the year — featuring award presentations, keynote remarks from industry leaders, a five-course dinner, and a curated networking floor. This evening is designed to celebrate excellence, forge powerful new relationships, and advance community.",
    imageUrl: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800&auto=format",
    startDate: "2026-06-06T18:00:00Z",
    endDate: "2026-06-06T23:00:00Z",
    location: "Ritz-Carlton, Atlanta, GA",
    venue: "The Ritz-Carlton Buckhead",
    city: "Atlanta",
    state: "GA",
    isOnline: false,
    isFeatured: true,
    isFree: false,
    slug: "professional",
    organizerName: "Black Professionals Network",
    attendeeCount: 280,
    totalTickets: 350,
    availableTickets: 70,
  },
  {
    title: "SaaS Growth Leaders Dinner",
    shortDescription: "Intimate dinner for SaaS founders and revenue leaders focused on B2B growth strategies.",
    description: "An exclusive sit-down dinner for 20 SaaS professionals at the Director level and above. Hosted under Chatham House rules, attendees share what's working in their go-to-market, PLG versus sales-led debates, pricing experiments, and enterprise expansion playbooks. Application required.",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format",
    startDate: "2026-05-28T19:00:00Z",
    endDate: "2026-05-28T22:00:00Z",
    location: "Quince Restaurant, San Francisco, CA",
    venue: "Quince",
    city: "San Francisco",
    state: "CA",
    isOnline: false,
    isFeatured: false,
    isFree: false,
    slug: "startup",
    organizerName: "SaaS Leaders Collective",
    attendeeCount: 16,
    totalTickets: 20,
    availableTickets: 4,
  },
];

const ticketPrices: Record<string, [number, number]> = {
  "startup": [75, 250],
  "conferences": [199, 499],
  "women": [35, 95],
  "virtual": [0, 0],
  "mixer": [0, 0],
  "technology": [25, 75],
  "alumni": [60, 120],
  "coffee": [0, 0],
  "workshop": [149, 299],
  "professional": [125, 350],
};

async function seed() {
  console.log("Clearing existing data...");
  await db.execute(sql`TRUNCATE registrations, tickets, events, categories RESTART IDENTITY CASCADE`);

  console.log("Seeding networking categories...");
  const insertedCategories = await db
    .insert(categoriesTable)
    .values(categories)
    .returning();

  const catMap = Object.fromEntries(
    insertedCategories.map((c) => [c.slug, c.id])
  );

  console.log("Seeding networking events...");
  const eventRows = events.map((e) => ({
    title: e.title,
    description: e.description,
    shortDescription: e.shortDescription,
    imageUrl: e.imageUrl,
    startDate: e.startDate,
    endDate: e.endDate,
    location: e.location,
    venue: e.venue,
    city: e.city,
    state: e.state ?? undefined,
    isOnline: e.isOnline,
    isFeatured: e.isFeatured,
    isFree: e.isFree,
    categoryId: catMap[e.slug],
    organizerName: e.organizerName,
    attendeeCount: e.attendeeCount,
    totalTickets: e.totalTickets,
    availableTickets: e.availableTickets,
  }));

  const insertedEvents = await db.insert(eventsTable).values(eventRows).returning();
  console.log(`Inserted ${insertedEvents.length} events`);

  const ticketEntries = [];
  for (const event of insertedEvents) {
    const slugEntry = events.find((e) => e.title === event.title);
    const slug = slugEntry?.slug ?? "professional";
    const [low, high] = ticketPrices[slug] ?? [25, 100];

    if (event.isFree) {
      ticketEntries.push({
        eventId: event.id,
        name: "Free RSVP",
        description: "Free admission — RSVP to secure your spot",
        price: "0",
        quantity: event.totalTickets,
        quantitySold: event.attendeeCount,
        isFree: true,
      });
    } else {
      ticketEntries.push({
        eventId: event.id,
        name: "General Admission",
        description: "Standard networking access to the event",
        price: low.toFixed(2),
        quantity: Math.floor(event.totalTickets * 0.7),
        quantitySold: Math.floor(event.attendeeCount * 0.65),
        isFree: false,
      });
      ticketEntries.push({
        eventId: event.id,
        name: "VIP Access",
        description: "Priority seating, pre-event drinks, and exclusive speaker access",
        price: high.toFixed(2),
        quantity: Math.floor(event.totalTickets * 0.3),
        quantitySold: Math.floor(event.attendeeCount * 0.35),
        isFree: false,
      });
    }
  }

  await db.insert(ticketsTable).values(ticketEntries);
  console.log(`Inserted ${ticketEntries.length} ticket types`);
  console.log("✅ Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
