import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, Filter, SlidersHorizontal, MapPin } from "lucide-react";
import { useListEvents, useListCategories } from "@workspace/api-client-react";
import { EventCard } from "@/components/events/EventCard";
import { useDebounce } from "@/hooks/use-debounce"; // We'll create a simple one inline if needed

export default function Events() {
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  
  // Custom tiny debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [isFree, setIsFree] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data: categoriesData } = useListCategories();
  
  const { data, isLoading, error } = useListEvents({
    search: debouncedSearch || undefined,
    location: location || undefined,
    category: category || undefined,
    isFree,
    page,
    limit,
  });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-4">Browse Events</h1>
          <p className="text-muted-foreground text-lg">
            Find what's happening next in your area or online.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="sticky top-28 bg-card border border-border p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-foreground font-semibold">
                <SlidersHorizontal className="w-5 h-5" />
                <h2>Filters</h2>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Keyword..." 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="City or Venue..." 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                  >
                    <option value="">All Categories</option>
                    {categoriesData?.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium mb-3">Price</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="price"
                        checked={isFree === undefined}
                        onChange={() => setIsFree(undefined)}
                        className="w-4 h-4 text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm">Any Price</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="price"
                        checked={isFree === true}
                        onChange={() => setIsFree(true)}
                        className="w-4 h-4 text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm">Free Only</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="price"
                        checked={isFree === false}
                        onChange={() => setIsFree(false)}
                        className="w-4 h-4 text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm">Paid Only</span>
                    </label>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    setSearch(""); setLocation(""); setCategory(""); setIsFree(undefined); setPage(1);
                  }}
                  className="w-full py-2 text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground font-medium">
                {isLoading ? "Searching..." : `${data?.total || 0} events found`}
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-[380px] bg-card rounded-2xl animate-pulse border border-border"></div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-center">
                Failed to load events. Please try again later.
              </div>
            ) : data?.events.length === 0 ? (
              <div className="text-center py-20 bg-card border border-border rounded-2xl">
                <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">No events found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or filters to find what you're looking for.</p>
                <button 
                  onClick={() => {
                    setSearch(""); setLocation(""); setCategory(""); setIsFree(undefined);
                  }}
                  className="px-6 py-2 bg-primary text-white rounded-xl font-medium"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {data?.events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>

                {/* Pagination */}
                {data && data.totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2">
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-border rounded-lg disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm font-medium">
                      Page {page} of {data.totalPages}
                    </span>
                    <button 
                      onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                      disabled={page === data.totalPages}
                      className="px-4 py-2 border border-border rounded-lg disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
