import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateEvent, useListCategories } from "@workspace/api-client-react";
import { CheckCircle2, ExternalLink } from "lucide-react";

const createEventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  shortDescription: z.string().min(10, "Provide a short description"),
  description: z.string().min(20, "Provide full event details"),
  eventDate: z.string().min(1, "Event date is required"),
  startTime: z.string().min(1, "Start time is required"),
  finishTime: z.string().min(1, "Finish time is required"),
  venue: z.string().optional(),
  location: z.string().optional(),
  city: z.string().optional(),
  isOnline: z.boolean(),
  isFree: z.boolean(),
  categoryId: z.coerce.number().min(1, "Category is required"),
  organizerName: z.string().min(2, "Organizer name is required"),
  registrationUrl: z.string().url("Must be a valid URL (e.g. https://...)").optional().or(z.literal("")),
  maxCapacity: z.coerce.number().min(0).optional(),
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
      eventDate: "",
      startTime: "",
      finishTime: "",
      venue: "",
      location: "",
      city: "",
      isOnline: false,
      isFree: false,
      categoryId: 0,
      organizerName: "",
      registrationUrl: "",
      maxCapacity: undefined,
    }
  });

  const isOnline = watch("isOnline");

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitError("");
      const payload = {
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description,
        eventDate: data.eventDate,
        startTime: data.startTime,
        finishTime: data.finishTime,
        venue: data.isOnline ? "Online" : (data.venue || ""),
        location: data.isOnline ? "Online" : (data.location || ""),
        city: data.isOnline ? "Online" : (data.city || ""),
        isOnline: data.isOnline,
        isFree: data.isFree,
        categoryId: data.categoryId,
        organizerName: data.organizerName,
        registrationUrl: data.registrationUrl || null,
        maxCapacity: data.maxCapacity || 0,
      };
      const res = await createMutation.mutateAsync({ data: payload });
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
          <h1 className="text-4xl font-display font-bold mb-2">List a Networking Event</h1>
          <p className="text-muted-foreground text-lg">Add your event to the IAN directory. Registration happens on your own platform.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {submitError && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-medium border border-destructive/20">
              {submitError}
            </div>
          )}

          {/* Event Details */}
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
                <label className={labelClass}>Organizer / Host *</label>
                <input {...register("organizerName")} className={inputClass} placeholder="Your name or organization" />
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Event Date *</label>
                <input type="date" {...register("eventDate")} className={inputClass} />
                {errors.eventDate && <p className={errorClass}>{errors.eventDate.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Start Time *</label>
                <input type="time" {...register("startTime")} className={inputClass} />
                {errors.startTime && <p className={errorClass}>{errors.startTime.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Finish Time *</label>
                <input type="time" {...register("finishTime")} className={inputClass} />
                {errors.finishTime && <p className={errorClass}>{errors.finishTime.message}</p>}
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" {...register("isOnline")} className="w-4 h-4 rounded text-primary" />
              <span className="text-sm font-medium">This is a virtual / online event</span>
            </label>

            {!isOnline && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Venue</label>
                  <input {...register("venue")} className={inputClass} placeholder="The Battery" />
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

          {/* Registration */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold border-b border-border pb-3">Registration</h2>

            <div>
              <label className={labelClass}>
                <ExternalLink className="inline w-4 h-4 mr-1 text-muted-foreground" />
                External Registration URL
              </label>
              <input
                {...register("registrationUrl")}
                className={inputClass}
                placeholder="https://lu.ma/your-event or https://eventbrite.com/e/..."
              />
              <p className="text-xs text-muted-foreground mt-1.5">Where attendees go to register. Leave blank if TBD.</p>
              {errors.registrationUrl && <p className={errorClass}>{errors.registrationUrl.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Max Capacity <span className="text-muted-foreground font-normal">(optional)</span></label>
                <input type="number" min="0" {...register("maxCapacity")} className={inputClass} placeholder="Leave blank for unlimited" />
                <p className="text-xs text-muted-foreground mt-1.5">Shows "Full" when capacity is reached.</p>
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" {...register("isFree")} className="w-4 h-4 rounded text-primary" />
                  <span className="text-sm font-medium">Free event</span>
                </label>
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
                List Event
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
