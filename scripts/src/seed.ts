import { db, categoriesTable, eventsTable, ticketsTable } from "@workspace/db";

const categories = [
  { name: "Music", slug: "music", icon: "🎵" },
  { name: "Business", slug: "business", icon: "💼" },
  { name: "Food & Drink", slug: "food-drink", icon: "🍕" },
  { name: "Sports & Fitness", slug: "sports", icon: "⚽" },
  { name: "Arts", slug: "arts", icon: "🎨" },
  { name: "Technology", slug: "technology", icon: "💻" },
  { name: "Health", slug: "health", icon: "❤️" },
  { name: "Community", slug: "community", icon: "🤝" },
  { name: "Film & Media", slug: "film-media", icon: "🎬" },
  { name: "Travel", slug: "travel", icon: "✈️" },
];

const eventImages = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format",
  "https://images.unsplash.com/photo-1476234251651-f353703a034d?w=800&auto=format",
  "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&auto=format",
  "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=800&auto=format",
  "https://images.unsplash.com/photo-1594623274890-6b45ce7cf44a?w=800&auto=format",
  "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&auto=format",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format",
];

async function seed() {
  console.log("Seeding database...");

  const existing = await db.select().from(categoriesTable);
  if (existing.length > 0) {
    console.log("Database already seeded, skipping...");
    process.exit(0);
  }

  const insertedCategories = await db
    .insert(categoriesTable)
    .values(categories)
    .returning();

  console.log(`Inserted ${insertedCategories.length} categories`);

  const catMap = Object.fromEntries(
    insertedCategories.map((c) => [c.slug, c.id])
  );

  const events = [
    {
      title: "San Francisco Tech Summit 2026",
      shortDescription: "The biggest tech conference on the West Coast featuring leaders from Google, Apple, and startups.",
      description: "Join us for three days of groundbreaking talks, workshops, and networking with over 5,000 tech professionals. Hear from CEOs, VCs, and visionary founders shaping the future of technology. This year's theme: AI, Sustainability, and the Future of Work.",
      imageUrl: eventImages[0],
      startDate: "2026-04-15T09:00:00Z",
      endDate: "2026-04-17T18:00:00Z",
      location: "Moscone Center, San Francisco, CA",
      venue: "Moscone Center",
      city: "San Francisco",
      state: "CA",
      isOnline: false,
      isFeatured: true,
      isFree: false,
      categoryId: catMap["technology"],
      organizerName: "TechSummit Inc.",
      attendeeCount: 3420,
      totalTickets: 5000,
      availableTickets: 1580,
    },
    {
      title: "Coachella Valley Music & Arts Festival",
      shortDescription: "Six days of music, art, and culture in the California desert.",
      description: "Experience an unforgettable weekend in the Coachella Valley with performances across 8 stages, immersive art installations, and gourmet food from top chefs. Featuring headliners across pop, rock, electronic, and hip-hop genres.",
      imageUrl: eventImages[11],
      startDate: "2026-04-10T12:00:00Z",
      endDate: "2026-04-19T23:59:00Z",
      location: "Empire Polo Club, Indio, CA",
      venue: "Empire Polo Club",
      city: "Indio",
      state: "CA",
      isOnline: false,
      isFeatured: true,
      isFree: false,
      categoryId: catMap["music"],
      organizerName: "Goldenvoice",
      attendeeCount: 75000,
      totalTickets: 100000,
      availableTickets: 25000,
    },
    {
      title: "New York Startup Week",
      shortDescription: "A week of entrepreneurship events, pitch competitions, and founder meetups in NYC.",
      description: "NYC Startup Week brings together thousands of founders, investors, and innovators for a city-wide celebration of entrepreneurship. Attend over 200 events across Manhattan, Brooklyn, and Queens — from intimate workshops to large networking parties.",
      imageUrl: eventImages[5],
      startDate: "2026-05-04T08:00:00Z",
      endDate: "2026-05-08T20:00:00Z",
      location: "Multiple Venues, New York, NY",
      venue: "Multiple Venues",
      city: "New York",
      state: "NY",
      isOnline: false,
      isFeatured: true,
      isFree: true,
      categoryId: catMap["business"],
      organizerName: "NYC Entrepreneurship Foundation",
      attendeeCount: 12000,
      totalTickets: 20000,
      availableTickets: 8000,
    },
    {
      title: "Global Marketing Leaders Conference",
      shortDescription: "Discover the latest trends in digital marketing, brand building, and growth strategies.",
      description: "The Global Marketing Leaders Conference brings together CMOs and marketing executives from Fortune 500 companies and fast-growing startups. Learn from the best on topics including influencer marketing, data analytics, brand storytelling, and performance marketing.",
      imageUrl: eventImages[5],
      startDate: "2026-06-10T09:00:00Z",
      endDate: "2026-06-11T17:00:00Z",
      location: "Chicago Convention Center, Chicago, IL",
      venue: "Chicago Convention Center",
      city: "Chicago",
      state: "IL",
      isOnline: false,
      isFeatured: false,
      isFree: false,
      categoryId: catMap["business"],
      organizerName: "MarketPro Events",
      attendeeCount: 1800,
      totalTickets: 3000,
      availableTickets: 1200,
    },
    {
      title: "Austin Food & Wine Festival",
      shortDescription: "Celebrating the best of Texas cuisine with star chefs, wine tastings, and live music.",
      description: "Three days of culinary excellence featuring over 50 of Austin's best restaurants and celebrity chefs. Enjoy wine pairings, cooking demonstrations, and exclusive tasting events. A must-attend for food and drink lovers.",
      imageUrl: eventImages[6],
      startDate: "2026-04-24T11:00:00Z",
      endDate: "2026-04-26T22:00:00Z",
      location: "Auditorium Shores, Austin, TX",
      venue: "Auditorium Shores",
      city: "Austin",
      state: "TX",
      isOnline: false,
      isFeatured: true,
      isFree: false,
      categoryId: catMap["food-drink"],
      organizerName: "Austin Eater Events",
      attendeeCount: 8500,
      totalTickets: 12000,
      availableTickets: 3500,
    },
    {
      title: "Virtual Wellness Summit 2026",
      shortDescription: "Live yoga, meditation, and wellness talks from world-class instructors — all online.",
      description: "Join thousands of wellness enthusiasts online for a full-day virtual experience packed with yoga sessions, guided meditations, motivational keynotes, and workshops on nutrition, mental health, and holistic living.",
      imageUrl: eventImages[7],
      startDate: "2026-05-15T07:00:00Z",
      endDate: "2026-05-15T20:00:00Z",
      location: "Online",
      venue: "Zoom / Live Stream",
      city: "Online",
      state: null,
      isOnline: true,
      isFeatured: false,
      isFree: true,
      categoryId: catMap["health"],
      organizerName: "Mindful Living Co.",
      attendeeCount: 22000,
      totalTickets: 50000,
      availableTickets: 28000,
    },
    {
      title: "Boston Marathon Community Run",
      shortDescription: "Run through historic Boston neighborhoods in this community 5K and 10K event.",
      description: "Celebrate fitness and community in the shadow of the Boston Marathon. Our community 5K and 10K runs wind through historic neighborhoods and finish near Copley Square. All fitness levels welcome — walkers and runners alike!",
      imageUrl: eventImages[3],
      startDate: "2026-04-20T07:00:00Z",
      endDate: "2026-04-20T12:00:00Z",
      location: "Copley Square, Boston, MA",
      venue: "Copley Square",
      city: "Boston",
      state: "MA",
      isOnline: false,
      isFeatured: false,
      isFree: false,
      categoryId: catMap["sports"],
      organizerName: "Run Boston Events",
      attendeeCount: 4200,
      totalTickets: 6000,
      availableTickets: 1800,
    },
    {
      title: "Los Angeles Art & Design Week",
      shortDescription: "Explore galleries, meet artists, and discover emerging designers across LA.",
      description: "LA Art & Design Week showcases the city's vibrant creative scene with curated gallery walks, exclusive studio visits, artist talks, and design exhibitions. From DTLA to Venice Beach, experience art in unexpected spaces.",
      imageUrl: eventImages[8],
      startDate: "2026-05-20T10:00:00Z",
      endDate: "2026-05-24T20:00:00Z",
      location: "Various Galleries, Los Angeles, CA",
      venue: "Multiple Venues",
      city: "Los Angeles",
      state: "CA",
      isOnline: false,
      isFeatured: false,
      isFree: true,
      categoryId: catMap["arts"],
      organizerName: "LA Arts Foundation",
      attendeeCount: 9800,
      totalTickets: 25000,
      availableTickets: 15200,
    },
    {
      title: "TED-style Talks: Future of AI",
      shortDescription: "Short, powerful talks on artificial intelligence from researchers, ethicists, and creators.",
      description: "Inspired by the TED format, this event brings together AI researchers, ethicists, artists, and entrepreneurs for 18-minute talks on the future of artificial intelligence. Topics include AI safety, creative AI, job displacement, and regulation.",
      imageUrl: eventImages[9],
      startDate: "2026-06-05T14:00:00Z",
      endDate: "2026-06-05T20:00:00Z",
      location: "The Commonwealth Club, San Francisco, CA",
      venue: "The Commonwealth Club",
      city: "San Francisco",
      state: "CA",
      isOnline: false,
      isFeatured: false,
      isFree: false,
      categoryId: catMap["technology"],
      organizerName: "AI Society",
      attendeeCount: 340,
      totalTickets: 500,
      availableTickets: 160,
    },
    {
      title: "Miami International Film Festival",
      shortDescription: "Two weeks of international cinema, director Q&As, and galas in Miami Beach.",
      description: "The Miami International Film Festival presents over 100 films from 50 countries, featuring premieres, director Q&As, and gala screenings. Discover world cinema, emerging filmmakers, and documentary highlights from around the globe.",
      imageUrl: eventImages[10],
      startDate: "2026-03-06T10:00:00Z",
      endDate: "2026-03-15T23:00:00Z",
      location: "Olympia Theater, Miami, FL",
      venue: "Olympia Theater",
      city: "Miami",
      state: "FL",
      isOnline: false,
      isFeatured: true,
      isFree: false,
      categoryId: catMap["film-media"],
      organizerName: "Miami Dade College",
      attendeeCount: 55000,
      totalTickets: 80000,
      availableTickets: 25000,
    },
    {
      title: "Chicago Jazz & Blues Festival",
      shortDescription: "Free outdoor festival celebrating jazz and blues in Grant Park.",
      description: "The Chicago Jazz & Blues Festival brings world-class musicians to Grant Park for a weekend of incredible free outdoor concerts. Enjoy performances on three stages across two days, with food vendors and artisan markets.",
      imageUrl: eventImages[4],
      startDate: "2026-07-04T12:00:00Z",
      endDate: "2026-07-06T22:00:00Z",
      location: "Grant Park, Chicago, IL",
      venue: "Grant Park Petrillo Music Shell",
      city: "Chicago",
      state: "IL",
      isOnline: false,
      isFeatured: false,
      isFree: true,
      categoryId: catMap["music"],
      organizerName: "City of Chicago DCASE",
      attendeeCount: 45000,
      totalTickets: 100000,
      availableTickets: 55000,
    },
    {
      title: "Seattle Community Tech Workshop",
      shortDescription: "Free intro-to-coding workshops for beginners, hosted by local developers.",
      description: "These monthly workshops are open to anyone looking to start their coding journey. Led by volunteers from local tech companies, each session covers HTML/CSS, JavaScript basics, or Python fundamentals. No experience required!",
      imageUrl: eventImages[1],
      startDate: "2026-04-18T10:00:00Z",
      endDate: "2026-04-18T15:00:00Z",
      location: "Seattle Public Library, Seattle, WA",
      venue: "Seattle Public Library",
      city: "Seattle",
      state: "WA",
      isOnline: false,
      isFeatured: false,
      isFree: true,
      categoryId: catMap["community"],
      organizerName: "Code Seattle",
      attendeeCount: 120,
      totalTickets: 200,
      availableTickets: 80,
    },
  ];

  const insertedEvents = await db.insert(eventsTable).values(events).returning();
  console.log(`Inserted ${insertedEvents.length} events`);

  const ticketEntries = [];
  for (const event of insertedEvents) {
    if (event.isFree) {
      ticketEntries.push({
        eventId: event.id,
        name: "General Admission",
        description: "Free entry to the event",
        price: "0",
        quantity: event.totalTickets,
        quantitySold: event.attendeeCount,
        isFree: true,
      });
    } else {
      ticketEntries.push({
        eventId: event.id,
        name: "General Admission",
        description: "Standard entry to the event",
        price: (Math.floor(Math.random() * 8 + 2) * 5).toFixed(2),
        quantity: Math.floor(event.totalTickets * 0.7),
        quantitySold: Math.floor(event.attendeeCount * 0.6),
        isFree: false,
      });
      ticketEntries.push({
        eventId: event.id,
        name: "VIP",
        description: "VIP access with premium seating and exclusive lounge",
        price: (Math.floor(Math.random() * 20 + 15) * 10).toFixed(2),
        quantity: Math.floor(event.totalTickets * 0.3),
        quantitySold: Math.floor(event.attendeeCount * 0.4),
        isFree: false,
      });
    }
  }

  await db.insert(ticketsTable).values(ticketEntries);
  console.log(`Inserted ${ticketEntries.length} ticket types`);
  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
