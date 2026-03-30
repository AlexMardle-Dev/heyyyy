import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { format } from "date-fns";
import { 
  Calendar, MapPin, Share2, Heart, Clock, User, 
  Info, Tag, Ticket as TicketIcon, CheckCircle2, X 
} from "lucide-react";
import { useGetEvent, useListTicketsByEvent, useCreateRegistration } from "@workspace/api-client-react";
import { formatCurrency, cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const registrationSchema = z.object({
  attendeeName: z.string().min(2, "Name is required"),
  attendeeEmail: z.string().email("Valid email is required"),
});

export default function EventDetail() {
  const { id } = useParams();
  const eventId = parseInt(id || "0", 10);
  const [, setLocation] = useLocation();

  const { data: event, isLoading: isLoadingEvent, error: eventError } = useGetEvent(eventId);
  const { data: tickets, isLoading: isLoadingTickets } = useListTicketsByEvent({ eventId }, { query: { enabled: !!eventId } });
  
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  const createRegMutation = useCreateRegistration();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      attendeeName: "",
      attendeeEmail: "",
    }
  });

  if (isLoadingEvent) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (eventError || !event) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-3xl font-bold mb-4">Event Not Found</h2>
      <p className="text-muted-foreground mb-8">The event you are looking for does not exist or has been removed.</p>
      <button onClick={() => setLocation("/events")} className="px-6 py-3 bg-primary text-white rounded-xl font-semibold">
        Browse Events
      </button>
    </div>
  );

  const activeTicket = tickets?.find(t => t.id === selectedTicket);
  const totalAmount = activeTicket ? activeTicket.price * quantity : 0;

  const onSubmit = async (data: any) => {
    if (!selectedTicket) return;
    try {
      const res = await createRegMutation.mutateAsync({
        data: {
          eventId: event.id,
          ticketId: selectedTicket,
          attendeeName: data.attendeeName,
          attendeeEmail: data.attendeeEmail,
          quantity: quantity,
        }
      });
      setConfirmationCode(res.confirmationCode);
      setCheckoutSuccess(true);
    } catch (err) {
      console.error("Failed to register", err);
    }
  };

  {/* generic fallback for header image */}
  const defaultImage = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80";

  return (
    <div className="min-h-screen bg-muted/20 pb-24">
      {/* Hero Header */}
      <div className="w-full h-[40vh] md:h-[60vh] relative overflow-hidden bg-black">
        <img 
          src={event.imageUrl || defaultImage} 
          alt={event.title}
          className="w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto">
          <span className="inline-block px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-semibold mb-4 backdrop-blur-md">
            {event.categoryName}
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground drop-shadow-lg mb-4 max-w-4xl">
            {event.title}
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl text-shadow-sm line-clamp-2">
            {event.shortDescription}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-12 relative">
          
          {/* Main Content */}
          <div className="flex-1 space-y-10">
            {/* Quick Info Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-card rounded-2xl border border-border shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Date and Time</h3>
                  <p className="text-muted-foreground text-sm">
                    Starts: {format(new Date(event.startDate), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Ends: {format(new Date(event.endDate), "h:mm a")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Location</h3>
                  <p className="text-muted-foreground text-sm">{event.isOnline ? "Online Event" : event.venue}</p>
                  {!event.isOnline && (
                    <p className="text-muted-foreground text-sm">{event.location}, {event.city}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-display font-bold mb-4">About this event</h2>
              <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {event.description}
              </div>
            </div>

            {/* Organizer */}
            <div className="p-8 bg-card border border-border rounded-2xl flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-1">Organized by {event.organizerName}</h3>
              <p className="text-sm text-muted-foreground mb-6">Contact the organizer with any questions</p>
              <button className="px-6 py-2 border-2 border-border hover:border-foreground rounded-full font-medium transition-colors">
                Contact Organizer
              </button>
            </div>
          </div>

          {/* Sticky Sidebar / Checkout */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="sticky top-28 bg-card border border-border rounded-3xl p-6 shadow-xl shadow-black/5">
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">Price</p>
                  <div className="text-3xl font-display font-bold text-foreground">
                    {event.isFree ? "Free" : event.minPrice ? `From ${formatCurrency(event.minPrice)}` : "TBD"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 border border-border rounded-full hover:bg-muted transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 border border-border rounded-full hover:bg-muted transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tickets Section */}
              <div className="mb-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TicketIcon className="w-5 h-5" /> Select Tickets
                </h3>
                
                {isLoadingTickets ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-16 bg-muted rounded-xl"></div>
                    <div className="h-16 bg-muted rounded-xl"></div>
                  </div>
                ) : tickets && tickets.length > 0 ? (
                  <div className="space-y-3">
                    {tickets.map(ticket => {
                      const available = ticket.quantity - ticket.quantitySold;
                      const isSoldOut = available <= 0;
                      const isSelected = selectedTicket === ticket.id;

                      return (
                        <div 
                          key={ticket.id}
                          onClick={() => !isSoldOut && setSelectedTicket(ticket.id)}
                          className={cn(
                            "p-4 rounded-xl border-2 cursor-pointer transition-all",
                            isSoldOut ? "opacity-50 cursor-not-allowed bg-muted" : "hover:border-primary/50",
                            isSelected ? "border-primary bg-primary/5" : "border-border bg-card"
                          )}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold">{ticket.name}</span>
                            <span className="font-semibold">{ticket.isFree ? "Free" : formatCurrency(ticket.price)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{ticket.description}</p>
                          {isSoldOut ? (
                            <span className="text-xs font-semibold text-destructive">Sold Out</span>
                          ) : (
                            <span className="text-xs font-medium text-green-600">{available} remaining</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="p-4 bg-muted rounded-xl text-center text-sm text-muted-foreground">
                    No tickets available currently.
                  </div>
                )}
              </div>

              <button 
                disabled={!selectedTicket}
                onClick={() => setShowCheckout(true)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary/90 text-white font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
              >
                Checkout
              </button>
              <p className="text-center text-xs text-muted-foreground mt-4">
                Secure checkout. No hidden fees.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !checkoutSuccess && setShowCheckout(false)}></div>
          
          <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            {checkoutSuccess ? (
              <div className="p-10 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-display font-bold mb-2">You're going!</h2>
                <p className="text-muted-foreground mb-8">
                  Your registration for <span className="font-semibold text-foreground">{event.title}</span> is confirmed.
                </p>
                <div className="bg-muted w-full p-4 rounded-xl mb-8">
                  <p className="text-sm text-muted-foreground mb-1">Confirmation Code</p>
                  <p className="text-2xl font-mono font-bold tracking-widest">{confirmationCode}</p>
                </div>
                <button 
                  onClick={() => {
                    setShowCheckout(false);
                    setLocation("/my-tickets");
                  }}
                  className="w-full py-4 bg-primary text-white rounded-xl font-bold"
                >
                  View My Tickets
                </button>
              </div>
            ) : (
              <>
                <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
                  <h3 className="font-bold text-lg">Checkout</h3>
                  <button onClick={() => setShowCheckout(false)} className="p-2 hover:bg-muted rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                  <div className="mb-6 pb-6 border-b border-border">
                    <h4 className="font-semibold mb-2">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{format(new Date(event.startDate), "MMM d, yyyy • h:mm a")}</p>
                    
                    <div className="mt-4 flex justify-between items-center bg-muted p-4 rounded-xl">
                      <div>
                        <p className="font-medium">{activeTicket?.name}</p>
                        <p className="text-sm text-muted-foreground">{activeTicket?.isFree ? 'Free' : formatCurrency(activeTicket?.price || 0)} each</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-primary"
                        >-</button>
                        <span className="font-bold w-4 text-center">{quantity}</span>
                        <button 
                          onClick={() => setQuantity(q => Math.min(10, q + 1))}
                          className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-primary"
                        >+</button>
                      </div>
                    </div>
                  </div>

                  <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input 
                        {...register("attendeeName")}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="John Doe"
                      />
                      {errors.attendeeName && <p className="text-red-500 text-xs mt-1">{errors.attendeeName.message as string}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email Address</label>
                      <input 
                        {...register("attendeeEmail")}
                        type="email"
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="john@example.com"
                      />
                      {errors.attendeeEmail && <p className="text-red-500 text-xs mt-1">{errors.attendeeEmail.message as string}</p>}
                      <p className="text-xs text-muted-foreground mt-2">We will send your tickets to this email.</p>
                    </div>
                  </form>
                </div>

                <div className="p-6 border-t border-border bg-muted/30">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="font-display font-bold text-2xl">{activeTicket?.isFree ? "Free" : formatCurrency(totalAmount)}</span>
                  </div>
                  <button 
                    type="submit"
                    form="checkout-form"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg hover:bg-primary/90 disabled:opacity-50 transition-all flex justify-center items-center"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      "Place Order"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
