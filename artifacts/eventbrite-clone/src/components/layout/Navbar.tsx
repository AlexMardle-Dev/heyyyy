import { Link, useLocation } from "wouter";
import { Search, Users, PlusCircle, Menu, X, UserCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Browse Events", path: "/events" },
    { name: "My Tickets", path: "/my-tickets" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-transparent border-b border-transparent py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-2xl font-display font-bold text-gradient hover:opacity-80 transition-opacity flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </div>
            IAN
          </Link>

          <div className="hidden md:flex relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search networking events..."
              className="pl-10 pr-4 py-2.5 w-80 bg-muted/50 border border-transparent rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background focus:border-primary/30 transition-all placeholder:text-muted-foreground/70"
            />
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={cn(
                "text-sm font-medium hover:text-primary transition-colors",
                location === link.path ? "text-primary" : "text-foreground/80"
              )}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="h-6 w-px bg-border mx-2" />

          <Link
            href="/create"
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Host Event
          </Link>
          
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background font-medium text-sm hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5">
            <UserCircle className="w-4 h-4" />
            Sign In
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white dark:bg-zinc-950 border-b border-border shadow-xl md:hidden flex flex-col p-4 gap-4"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-3 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl hover:bg-muted font-medium text-foreground"
              >
                {link.name}
              </Link>
            ))}
            
            <Link
              href="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-primary/10 text-primary font-medium flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Host Event
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
