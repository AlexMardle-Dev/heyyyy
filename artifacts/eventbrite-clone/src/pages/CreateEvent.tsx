import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateEvent, useListCategories } from "@workspace/api-client-react";

const createEventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  shortDescription: z.string().min(10, "Provide a short description"),
  description: z.string().min(20, "Provide full event details"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  location: z.string().min(2, "Location is required"),
  venue: z.string().min(2, "Venue is required"),
  city: z.string().min(2, "City is required"),
  isOnline: z.boolean(),
  isFree: z.boolean(),
  categoryId: z.coerce.number().min(1, "Category is required"),
  organizerName: z.string().min(2, "Organizer name is required")
});

export default function CreateEvent() {
  const [, setLocation] = useLocation();
  const { data: categories } = useListCategories();
  const createMutation = useCreateEvent();
  const [submitError, setSubmitError] = useState("");

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
      imageUrl: "",
      startDate: "",
      endDate: "",
      location: "",
      venue: "",
      city: "",
      isOnline: false,
      isFree: false,
      categoryId: 0,
      organizerName: ""
    }
  });

  const isOnline = watch("isOnline");

  const onSubmit = async (data: any) => {
    try {
      setSubmitError("");
      const res = await createMutation.mutateAsync({ data });
      setLocation(`/events/${res.id}`);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to create event");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-muted/10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold mb-2">Create New Event</h1>
        <p className="text-muted-foreground mb-8">Fill out the details below to publish your event.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-card p-8 rounded-3xl shadow-sm border border-border">
          
          {submitError && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-medium">
              {submitError}
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-bold border-b border-border pb-2">Basic Info</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">Event Title</label>
              <input {...register("title")} className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="My Awesome Event" />
              {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message as string}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select {...register("categoryId")} className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                  <option value={0}>Select Category...</option>
                  {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.categoryId && <p className="text-destructive text-xs mt-1">{errors.categoryId.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Organizer Name</label>
                <input {...register("organizerName")} className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Company or Individual" />
                {errors.organizerName && <p className="text-destructive text-xs mt-1">{errors.organizerName.message as string}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold border-b border-border pb-2">Location & Date</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date & Time</label>
                <input type="datetime-local" {...register("startDate")} className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                {errors.startDate && <p className="text-destructive text-xs mt-1">{errors.startDate.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date & Time</label>
                <input type="datetime-local" {...register("endDate")} className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                {errors.endDate && <p className="text-destructive text-xs mt-1">{errors.endDate.message as string}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 mb-2">
              <input type="checkbox" id="isOnline" {...register("isOnline")} className="w-4 h-4 text-primary" />
              <label htmlFor="isOnline" className="text-sm font-medium cursor-pointer">This is an online event</label>
            </div>

            {!isOnline && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Venue Name</label>
                  <input {...register("venue")} className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Convention Center" />
                  {errors.venue && <p className="text-destructive text-xs mt-1">{errors.venue.message as string}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address / Location</label>
                  <input {...register("location")} className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="123 Main St" />
                  {errors.location && <p className="text-destructive text-xs mt-1">{errors.location.message as string}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input {...register("city")} className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="New York" />
                  {errors.city && <p className="text-destructive text-xs mt-1">{errors.city.message as string}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold border-b border-border pb-2">Details</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">Short Description (Summary)</label>
              <textarea {...register("shortDescription")} rows={2} className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" placeholder="A brief hook for your event..." />
              {errors.shortDescription && <p className="text-destructive text-xs mt-1">{errors.shortDescription.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Full Description</label>
              <textarea {...register("description")} rows={6} className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Tell attendees what to expect..." />
              {errors.description && <p className="text-destructive text-xs mt-1">{errors.description.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cover Image URL (Optional)</label>
              <input {...register("imageUrl")} className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="https://..." />
              {errors.imageUrl && <p className="text-destructive text-xs mt-1">{errors.imageUrl.message as string}</p>}
            </div>
            
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              <input type="checkbox" id="isFree" {...register("isFree")} className="w-4 h-4 text-primary" />
              <label htmlFor="isFree" className="text-sm font-medium cursor-pointer">This event is completely free</label>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-all flex justify-center items-center"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
