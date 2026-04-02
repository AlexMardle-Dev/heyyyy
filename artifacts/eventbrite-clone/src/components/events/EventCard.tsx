import { Link } from "wouter";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { type Event } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";

const CATEGORY_GRADIENTS: Record<string, string> = {
  "Professional Meetup": "from-blue-600 to-blue-800",
  "Conference": "from-violet-600 to-violet-900",
  "Startup & Entrepreneurship": "from-orange-500 to-red-600",
  "Technology": "from-indigo-500 to-indigo-800",
  "Alumni Network": "from-purple-600 to-purple-900",
  "Virtual Networking": "from-teal-500 to-teal-800",
  "Coffee Chats": "from-amber-600 to-amber-800",
  "Industry Mixer": "from-slate-600 to-slate-900",
  "Workshop & Training": "from-emerald-600 to-emerald-900",
  "Women in Business": "from-pink-500 to-rose-700",
};

const DEFAULT_GRADIENT = "from-primary to-secondary";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const date = event.eventDate ? new Date(event.eventDate) : null;
  const isValidDate = date && !isNaN(date.getTime());
  const gradient = CATEGORY_GRADIENTS[event.categoryName] ?? DEFAULT_GRADIENT;

  return (
    <Link href={`/events/${event.id}`}>
      <div className="group h-full bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1">
        {/* Gradient Header */}
        <div className={`relative bg-gradient-to-br ${gradient} p-6 flex items-end min-h-[120px]`}>
          <div className="absolute top-4 right-4">
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              {event.isFree ? "Free" : event.minPrice ? formatCurrency(event.minPrice) : "Paid"}
            </span>
          </div>
          <div className="text-white">
            <div className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">{event.categoryName}</div>
            <div className="text-3xl font-bold leading-none">{isValidDate ? format(date!, "d") : "—"}</div>
            <div className="text-white/80 text-sm font-medium">{isValidDate ? format(date!, "MMM yyyy") : "TBD"}</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="font-bold text-lg text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors mb-3">
            {event.title}
          </h3>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary/70 shrink-0" />
              <span className="truncate">{isValidDate ? `${format(date!, "EEEE")}${(event as any).startTime ? `, ${(event as any).startTime}` : ""}` : "Date TBD"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary/70 shrink-0" />
              <span className="truncate">{event.isOnline ? "Online Event" : event.venue || event.city}</span>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground mt-4">
            <span className="font-medium text-foreground truncate">{event.organizerName}</span>
            {(event as any).isFull ? (
              <span className="bg-destructive/10 text-destructive px-2 py-1 rounded-md font-semibold shrink-0 ml-2">
                Full
              </span>
            ) : (event as any).registrationUrl ? (
              <span className="flex items-center gap-1 text-primary font-medium shrink-0 ml-2">
                <ExternalLink className="w-3 h-3" /> Register
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
