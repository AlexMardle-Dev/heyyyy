import { Link, useLocation } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar as CalendarIcon, ArrowRight, Music, Monitor, Utensils, Brush, Briefcase, Activity } from "lucide-react";
import { useListEvents, useGetFeaturedEvents } from "@workspace/api-client-react";
import { EventCard } from "@/components/events/EventCard";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { name: "Music", icon: Music, color: "bg-blue-500", img: "music-cat.png" },
  { name: "Tech", icon: Monitor, color: "bg-indigo-500", img: "business-cat.png" },
  { name: "Food", icon: Utensils, color: "bg-orange-500", img: "food-cat.png" },
  { name: "Arts", icon: Brush, color: "bg-pink-500", img: "business-cat.png" },
  { name: "Business", icon: Briefcase, color: "bg-slate-800", img: "business-cat.png" },
  { name: "Sports", icon: Activity, color: "bg-green-500", img: "business-cat.png" }
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoc, setSearchLoc] = useState("");

  const { data: featuredEvents, isLoading: isLoadingFeatured } = useGetFeaturedEvents();
  const { data: eventData, isLoading: isLoadingEvents } = useListEvents({ limit: 6, page: 1 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (searchLoc) params.append("location", searchLoc);
    setLocation(`/events?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative w-full py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Hero abstract background" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-background/80 md:bg-background/40 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              Discover <span className="text-gradient">unforgettable</span> moments near you.
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl leading-relaxed">
              From epic concerts to intimate workshops, explore thousands of events curated just for you. Get your tickets and make memories.
            </p>

            <div className="glass-panel p-2 rounded-2xl md:rounded-full w-full max-w-4xl shadow-2xl shadow-primary/10">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative flex items-center px-4 py-3 md:py-0 border-b md:border-b-0 md:border-r border-border">
                  <Search className="w-5 h-5 text-primary shrink-0 mr-3" />
                  <input 
                    type="text"
                    placeholder="Search events, organizers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="flex-1 relative flex items-center px-4 py-3 md:py-0">
                  <MapPin className="w-5 h-5 text-secondary shrink-0 mr-3" />
                  <input 
                    type="text"
                    placeholder="Location (e.g. New York)"
                    value={searchLoc}
                    onChange={(e) => setSearchLoc(e.target.value)}
                    className="w-full bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl md:rounded-full px-8 py-4 font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Find Events
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-display font-bold">Explore Categories</h2>
            <Link href="/events" className="hidden md:flex items-center text-primary font-medium hover:underline">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                key={cat.name}
              >
                <Link href={`/events?category=${cat.name}`}>
                  <div className="group bg-card rounded-2xl p-6 flex flex-col items-center justify-center gap-4 border border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all cursor-pointer">
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg", cat.color)}>
                      <cat.icon className="w-8 h-8" />
                    </div>
                    <span className="font-semibold text-foreground">{cat.name}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {(!isLoadingFeatured && featuredEvents && featuredEvents.length > 0) && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold mb-10 flex items-center gap-3">
              <span className="inline-block w-3 h-8 bg-secondary rounded-full"></span>
              Featured Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Events */}
      <section className="py-20 bg-muted/10 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-display font-bold flex items-center gap-3">
              <span className="inline-block w-3 h-8 bg-primary rounded-full"></span>
              Trending Near You
            </h2>
            <Link href="/events" className="flex items-center text-primary font-medium hover:underline">
              See more <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {isLoadingEvents ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-[400px] bg-muted animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : eventData?.events ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventData.events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
             <div className="py-12 text-center text-muted-foreground">No events found.</div>
          )}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-10 dark:opacity-20" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Host your own event</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Whether it's a neighborhood block party or a global virtual conference, EventHub gives you the tools to create, manage, and sell out your events.
          </p>
          <Link href="/create">
            <button className="bg-foreground text-background px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary hover:text-white transition-all hover:shadow-xl hover:-translate-y-1">
              Create an Event
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
