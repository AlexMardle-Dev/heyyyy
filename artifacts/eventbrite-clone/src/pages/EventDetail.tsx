import { useParams, useLocation } from "wouter";
import { format } from "date-fns";
import { Calendar, MapPin, Share2, User, ExternalLink, AlertCircle } from "lucide-react";
import { useGetEvent } from "@workspace/api-client-react";

export default function EventDetail() {
  const { id } = useParams();
  const eventId = parseInt(id || "0", 10);
  const [, setLocation] = useLocation();

  const { data: event, isLoading, error } = useGetEvent(eventId);

  if (isLoading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !event) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-3xl font-bold mb-4">Event Not Found</h2>
      <p className="text-muted-foreground mb-8">This event doesn't exist or has been removed.</p>
      <button onClick={() => setLocation("/events")} className="px-6 py-3 bg-primary text-white rounded-xl font-semibold">
        Browse Events
      </button>
    </div>
  );

  const startDate = event.startDate ? new Date(event.startDate) : null;
  const endDate = event.endDate ? new Date(event.endDate) : null;
  const isValidStart = startDate && !isNaN(startDate.getTime());
  const isValidEnd = endDate && !isNaN(endDate.getTime());
  const isFull = (event as any).isFull as boolean;
  const registrationUrl = (event as any).registrationUrl as string | null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: event.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-24">
      {/* Gradient Hero */}
      <div className="w-full bg-gradient-to-br from-primary via-secondary to-violet-700 relative overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 bg-white/20 text-white border border-white/30 rounded-full text-sm font-semibold mb-4">
                {event.categoryName}
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 max-w-4xl leading-tight">
                {event.title}
              </h1>
              <p className="text-lg text-white/80 max-w-2xl line-clamp-2">
                {event.shortDescription}
              </p>
            </div>
            <button onClick={handleShare} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors mt-1 shrink-0">
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 bg-card rounded-2xl border border-border shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Date & Time</h3>
                  {isValidStart ? (
                    <>
                      <p className="text-muted-foreground text-sm">
                        {format(startDate!, "EEEE, MMMM d, yyyy")}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {format(startDate!, "h:mm a")}
                        {isValidEnd && ` – ${format(endDate!, "h:mm a")}`}
                      </p>
                    </>
                  ) : (
                    <p className="text-muted-foreground text-sm">Date TBD</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Location</h3>
                  {event.isOnline ? (
                    <p className="text-muted-foreground text-sm">Online Event</p>
                  ) : (
                    <>
                      {event.venue && <p className="text-muted-foreground text-sm">{event.venue}</p>}
                      <p className="text-muted-foreground text-sm">
                        {[event.location, event.city, event.state].filter(Boolean).join(", ")}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-display font-bold mb-4">About this event</h2>
              <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {event.description}
              </div>
            </div>

            {/* Organizer */}
            <div className="p-6 bg-card border border-border rounded-2xl flex items-center gap-5">
              <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center shrink-0">
                <User className="w-7 h-7 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-0.5">Organized by</p>
                <h3 className="font-bold text-lg">{event.organizerName}</h3>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[360px] shrink-0">
            <div className="sticky top-28 bg-card border border-border rounded-3xl p-6 shadow-xl shadow-black/5 space-y-5">

              {/* Price */}
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wide">Price</p>
                <div className="text-3xl font-display font-bold">
                  {event.isFree ? "Free" : "Paid"}
                </div>
              </div>

              {/* Full Badge */}
              {isFull && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-xl text-sm font-semibold border border-destructive/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  This event is at full capacity
                </div>
              )}

              {/* CTA */}
              {registrationUrl ? (
                <a
                  href={registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                    isFull
                      ? "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
                      : "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
                  }`}
                >
                  <ExternalLink className="w-5 h-5" />
                  {isFull ? "Registration Closed" : "Register Now"}
                </a>
              ) : (
                <div className="w-full py-4 rounded-xl bg-muted text-muted-foreground font-medium text-center text-sm">
                  Registration link coming soon
                </div>
              )}

              <p className="text-center text-xs text-muted-foreground">
                Registration is handled by the event organizer.
              </p>

              {/* Date summary */}
              {isValidStart && (
                <div className="pt-4 border-t border-border space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary/70 shrink-0" />
                    <span>{format(startDate!, "MMMM d, yyyy • h:mm a")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary/70 shrink-0" />
                    <span>{event.isOnline ? "Online" : event.city || event.venue}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
