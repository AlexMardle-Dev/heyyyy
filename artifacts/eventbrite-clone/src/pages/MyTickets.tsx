import { useListRegistrations } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Ticket, Calendar, QrCode } from "lucide-react";
import { Link } from "wouter";
import { formatCurrency } from "@/lib/utils";

export default function MyTickets() {
  const { data: registrations, isLoading } = useListRegistrations();

  return (
    <div className="min-h-screen pt-24 pb-20 bg-muted/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold mb-8">My Tickets</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-card rounded-2xl animate-pulse border border-border"></div>
            ))}
          </div>
        ) : registrations && registrations.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {registrations.map((reg) => (
              <div key={reg.id} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow">
                
                {/* Visual stub for a ticket stub */}
                <div className="w-full md:w-48 bg-gradient-to-br from-primary to-secondary p-6 flex flex-col items-center justify-center text-white relative border-r-2 border-dashed border-white/20">
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-muted/10 rounded-full"></div>
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-card rounded-full hidden md:block"></div>
                  
                  <Ticket className="w-12 h-12 mb-2 opacity-80" />
                  <span className="font-mono tracking-widest text-sm bg-black/20 px-3 py-1 rounded-md mt-2">
                    {reg.confirmationCode}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold font-display line-clamp-1">{reg.eventTitle}</h3>
                      <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-md whitespace-nowrap">
                        Confirmed
                      </span>
                    </div>
                    
                    <div className="text-muted-foreground text-sm space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Purchased on {format(new Date(reg.createdAt), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between pt-4 border-t border-border gap-4">
                    <div className="flex gap-6">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Ticket Type</p>
                        <p className="font-medium">{reg.ticketName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Quantity</p>
                        <p className="font-medium">{reg.quantity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total</p>
                        <p className="font-medium">{reg.totalAmount === 0 ? 'Free' : formatCurrency(reg.totalAmount)}</p>
                      </div>
                    </div>
                    <Link href={`/events/${reg.eventId}`}>
                      <button className="text-primary text-sm font-semibold hover:underline">
                        View Event Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card border border-border rounded-3xl shadow-sm">
            <QrCode className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No tickets yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You haven't registered for any events yet. Explore events and find your next experience!
            </p>
            <Link href="/events">
              <button className="px-8 py-3 bg-primary text-white rounded-full font-semibold shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                Discover Events
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
