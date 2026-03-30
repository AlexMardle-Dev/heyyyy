import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateEvent, useListCategories, useListTicketsByEvent } from "@workspace/api-client-react";
import { CheckCircle2 } from "lucide-react";

const createEventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  shortDescription: z.string().min(10, "Provide a short description"),
  description: z.string().min(20, "Provide full event details"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  venue: z.string().optional(),
  location: z.string().optional(),
  city: z.string().optional(),
  isOnline: z.boolean(),
  isFree: z.boolean(),
  categoryId: z.coerce.number().min(1, "Category is required"),
  organizerName: z.string().min(2, "Organizer name is required"),
  ticketName: z.string().min(2, "Ticket name is required"),
  ticketPrice: z.coerce.number().min(0, "Price must be 0 or more"),
  ticketQuantity: z.coerce.number().min(1, "Must have at least 1 ticket"),
});

type FormData = z.infer<typeof createEventSchema>;

export default function CreateEvent() {
  const [, setLocation] = useLocation();
  const { data: categories } = useListCategories();
  const createMutation = useCreateEvent();
  const [submitError, setSubmitError] = useState("");

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
      startDate: "",
      endDate: "",
      venue: "",
      location: "",
      city: "",
      isOnline: false,
      isFree: false,
      categoryId: 0,
      organizerName: "",
      ticketName: "General Admission",
      ticketPrice: 0,
      ticketQuantity: 100,
    }
  });

  const isOnline = watch("isOnline");
  const isFree = watch("isFree");

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitError("");

      const eventPayload = {
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        venue: data.isOnline ? "Online" : (data.venue || ""),
        location: data.isOnline ? "Online" : (data.location || ""),
        city: data.isOnline ? "Online" : (data.city || ""),
        isOnline: data.isOnline,
        isFree: data.isFree,
        categoryId: data.categoryId,
        organizerName: data.organizerName,
        ticketName: data.ticketName,
        ticketPrice: data.isFree ? 0 : data.ticketPrice,
        ticketQuantity: data.ticketQuantity,
      };

      const res = await createMutation.mutateAsync({ data: eventPayload });
      setLocation(`/events/${res.id}`);
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to create event. Please try again.");
    }
  };

  const inputClass = "w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm";
  const labelClass = "block text-sm font-medium mb-1.5";
  const errorClass = "text-destructive text-xs mt-1";

  return (
    <div className="min-h-screen pt-24 pb-20 bg-muted/10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-display font-bold mb-2">Host a Networking Event</h1>
          <p className="text-muted-foreground text-lg">Fill in the details below and your event will go live immediately.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

          {submitError && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-medium border border-destructive/20">
              {submitError}
            </div>
          )}

          {/* Basic Info */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold border-b border-border pb-3">Event Details</h2>

            <div>
              <label className={labelClass}>Event Title *</label>
              <input {...register("title")} className={inputClass} placeholder="e.g. SF Founders & Investors Mixer" />
              {errors.title && <p className={errorClass}>{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Category *</label>
                <select {...register("categoryId")} className={inputClass + " appearance-none"}>
                  <option value={0}>Select a category...</option>
                  {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.categoryId && <p className={errorClass}>{errors.categoryId.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Organizer / Host Name *</label>
                <input {...register("organizerName")} className={inputClass} placeholder="Your name or company" />
                {errors.organizerName && <p className={errorClass}>{errors.organizerName.message}</p>}
              </div>
            </div>

            <div>
              <label className={labelClass}>One-line Summary *</label>
              <input {...register("shortDescription")} className={inputClass} placeholder="A brief hook that gets people excited to attend" />
              {errors.shortDescription && <p className={errorClass}>{errors.shortDescription.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Full Description *</label>
              <textarea {...register("description")} rows={5} className={inputClass + " resize-none"} placeholder="Tell attendees what to expect, who should come, what they'll get out of it..." />
              {errors.description && <p className={errorClass}>{errors.description.message}</p>}
            </div>
          </div>

          {/* Date & Location */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold border-b border-border pb-3">Date & Location</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Start Date & Time *</label>
                <input type="datetime-local" {...register("startDate")} className={inputClass} />
                {errors.startDate && <p className={errorClass}>{errors.startDate.message}</p>}
              </div>
              <div>
                <label className={labelClass}>End Date & Time *</label>
                <input type="datetime-local" {...register("endDate")} className={inputClass} />
                {errors.endDate && <p className={errorClass}>{errors.endDate.message}</p>}
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" {...register("isOnline")} className="w-4 h-4 rounded text-primary" />
              <span className="text-sm font-medium">This is a virtual / online event</span>
            </label>

            {!isOnline && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Venue *</label>
                  <input {...register("venue")} className={inputClass} placeholder="The Battery" />
                  {errors.venue && <p className={errorClass}>{errors.venue.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Address</label>
                  <input {...register("location")} className={inputClass} placeholder="123 Main St" />
                </div>
                <div>
                  <label className={labelClass}>City *</label>
                  <input {...register("city")} className={inputClass} placeholder="San Francisco" />
                  {errors.city && <p className={errorClass}>{errors.city.message}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Tickets */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold border-b border-border pb-3">Tickets</h2>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" {...register("isFree")} className="w-4 h-4 rounded text-primary" />
              <span className="text-sm font-medium">This is a free event</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Ticket Name</label>
                <input {...register("ticketName")} className={inputClass} placeholder="General Admission" />
                {errors.ticketName && <p className={errorClass}>{errors.ticketName.message}</p>}
              </div>
              {!isFree && (
                <div>
                  <label className={labelClass}>Price (USD)</label>
                  <input type="number" min="0" step="0.01" {...register("ticketPrice")} className={inputClass} placeholder="50.00" />
                  {errors.ticketPrice && <p className={errorClass}>{errors.ticketPrice.message}</p>}
                </div>
              )}
              <div>
                <label className={labelClass}>Quantity Available</label>
                <input type="number" min="1" {...register("ticketQuantity")} className={inputClass} placeholder="100" />
                {errors.ticketQuantity && <p className={errorClass}>{errors.ticketQuantity.message}</p>}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Publish Event
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
