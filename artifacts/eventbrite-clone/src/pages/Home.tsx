import { Link, useLocation } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, ArrowRight, Users, Briefcase, Laptop, GraduationCap, Rocket, Globe, Coffee, Network } from "lucide-react";
import { useListEvents, useGetFeaturedEvents } from "@workspace/api-client-react";
import { EventCard } from "@/components/events/EventCard";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { name: "Professional", slug: "professional", icon: Briefcase, color: "bg-blue-600" },
  { name: "Tech", slug: "technology", icon: Laptop, color: "bg-indigo-500" },
  { name: "Startup", slug: "startup", icon: Rocket, color: "bg-orange-500" },
  { name: "Alumni", slug: "alumni", icon: GraduationCap, color: "bg-purple-500" },
  { name: "Virtual", slug: "virtual", icon: Globe, color: "bg-teal-500" },
  { name: "Coffee Chats", slug: "coffee", icon: Coffee, color: "bg-amber-600" },
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
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6 border border-primary/20">
              <Network className="w-4 h-4" />
              The professional networking platform
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              Build connections that <span className="text-gradient">actually matter.</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl leading-relaxed">
              IAN connects ambitious professionals through curated networking events — meetups, conferences, workshops, and mixers built for real relationship building.
            </p>

            <div className="glass-panel p-2 rounded-2xl md:rounded-full w-full max-w-4xl shadow-2xl shadow-primary/10">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative flex items-center px-4 py-3 md:py-0 border-b md:border-b-0 md:border-r border-border">
                  <Search className="w-5 h-5 text-primary shrink-0 mr-3" />
                  <input 
                    type="text"
                    placeholder="Search events, industries, topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="flex-1 relative flex items-center px-4 py-3 md:py-0">
                  <MapPin className="w-5 h-5 text-secondary shrink-0 mr-3" />
                  <input 
                    type="text"
                    placeholder="City or 'Online'"
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

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-10">
              {[
                { label: "Professionals connected", value: "50K+" },
                { label: "Events hosted", value: "2,400+" },
                { label: "Cities worldwide", value: "120+" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-display font-bold">Browse by Type</h2>
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
                <Link href={`/events?category=${cat.slug}`}>
                  <div className="group bg-card rounded-2xl p-6 flex flex-col items-center justify-center gap-4 border border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all cursor-pointer">
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg", cat.color)}>
                      <cat.icon className="w-8 h-8" />
                    </div>
                    <span className="font-semibold text-foreground text-center text-sm">{cat.name}</span>
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
              Upcoming Near You
            </h2>
            <Link href="/events" className="flex items-center text-primary font-medium hover:underline">
              See all <ArrowRight className="w-4 h-4 ml-1" />
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

      {/* Why IAN */}
      <section className="py-24 bg-muted/20 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Why IAN?</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Professional networking shouldn't feel like small talk. IAN makes every connection count.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Curated Connections", desc: "Every event is designed around professional relationship building — not just attendance." },
              { icon: Network, title: "Industry-Focused", desc: "Filter by your field, role, or interest. Meet people who get what you do." },
              { icon: Globe, title: "In-Person & Online", desc: "Attend local meetups or join global virtual events from anywhere in the world." },
            ].map((item) => (
              <div key={item.title} className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg hover:shadow-primary/5 transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-10 dark:opacity-20" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Host a networking event</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Whether it's an intimate founder dinner or a large industry conference, IAN gives you the tools to create meaningful professional gatherings.
          </p>
          <Link href="/create">
            <button className="bg-foreground text-background px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary hover:text-white transition-all hover:shadow-xl hover:-translate-y-1">
              Host an Event
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
