import { Link } from "wouter";
import { Calendar, MapPin, Tag } from "lucide-react";
import { format } from "date-fns";
import { type Event } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const date = new Date(event.startDate);
  
  // Use a fallback image depending on category if none provided
  const fallbackImages: Record<string, string> = {
    'Music': 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
    'Tech': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    'Food': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    'Arts': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80',
    'Business': 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80'
  };

  {/* generic event stock photo fallback */}
  const defaultImage = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80";
  
  const imageUrl = event.imageUrl || fallbackImages[event.categoryName] || defaultImage;

  return (
    <Link href={`/events/${event.id}`}>
      <div className="group h-full bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1">
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img 
            src={imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
          
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="bg-white/90 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
              {event.isFree ? "Free" : event.minPrice ? `From ${formatCurrency(event.minPrice)}` : "Paid"}
            </span>
          </div>

          <div className="absolute top-4 right-4">
            <span className="bg-black/50 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {event.categoryName}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex gap-4 items-start mb-3">
            <div className="flex flex-col items-center justify-center text-center bg-primary/10 text-primary rounded-xl p-2 min-w-[3.5rem]">
              <span className="text-xs font-bold uppercase tracking-wider">{format(date, 'MMM')}</span>
              <span className="text-xl font-display font-bold leading-none">{format(date, 'dd')}</span>
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                {event.title}
              </h3>
            </div>
          </div>

          <div className="mt-auto space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary/70 shrink-0" />
              <span className="truncate">{format(date, 'EEEE, h:mm a')}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary/70 shrink-0" />
              <span className="truncate">{event.isOnline ? 'Online Event' : event.venue || event.location}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{event.organizerName}</span>
            {event.attendeeCount > 0 && (
              <span className="bg-secondary/10 text-secondary px-2 py-1 rounded-md font-medium">
                {event.attendeeCount} attending
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
