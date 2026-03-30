import { Link } from "wouter";
import { Users, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-display font-bold flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white">
                <Users className="w-5 h-5" />
              </div>
              IAN
            </Link>
            <p className="text-background/60 text-sm mb-6 leading-relaxed">
              The networking platform built for professionals. Discover events, build meaningful connections, and grow your career.
            </p>
            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="font-display font-semibold mb-6">Discover</h3>
            <ul className="space-y-4 text-sm text-background/60">
              <li><Link href="/events?category=professional" className="hover:text-primary transition-colors">Professional Meetups</Link></li>
              <li><Link href="/events?category=conferences" className="hover:text-primary transition-colors">Conferences</Link></li>
              <li><Link href="/events?category=startup" className="hover:text-primary transition-colors">Startup Events</Link></li>
              <li><Link href="/events?category=virtual" className="hover:text-primary transition-colors">Virtual Networking</Link></li>
              <li><Link href="/events?isFree=true" className="hover:text-primary transition-colors">Free Events</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display font-semibold mb-6">Host Events</h3>
            <ul className="space-y-4 text-sm text-background/60">
              <li><Link href="/create" className="hover:text-primary transition-colors">Create a Networking Event</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Ticketing & RSVPs</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Host Guidelines</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Event Management</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display font-semibold mb-6">Stay Connected</h3>
            <p className="text-background/60 text-sm mb-4">
              Get notified about networking events in your city and industry.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-background/10 border border-background/20 rounded-xl px-4 py-2 w-full text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl font-medium transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-background/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/40">
          <p>© 2026 IAN — I Am Networking. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
