import { useState } from "react";
import { MapPin, Navigation, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchCardProps {
    onSearch: () => void;
}

const SearchCard = ({ onSearch }: SearchCardProps) => {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onSearch();
   
    };

    return (
        <div className="bg-card/95 backdrop-blur-xl rounded-2xl shadow-card-hover p-8 w-full max-w-2xl animate-fade-in-up">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    Discover Your Perfect Route
                </h1>
                <p className="text-muted-foreground">
                    Compare scenic, fast, and alternative routes with street-view previews
                </p>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={onSearch}
                    className="
            px-6 py-3 text-lg font-semibold
            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
            text-white rounded-xl shadow-lg
            hover:scale-105 hover:brightness-110
            transition-all duration-300
        "
                >
                    Start Exploring
                </button>
            </div>



            {/* <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-route-scenic/10 flex items-center justify-center transition-all group-focus-within:bg-route-scenic/20">
              <MapPin className="w-5 h-5 text-route-scenic" />
            </div>
            <Input
              type="text"
              placeholder="Starting point"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="pl-16 h-14 text-lg border-2 border-border focus-visible:border-primary focus-visible:ring-0 rounded-xl bg-background"
            />
          </div>

          <div className="flex justify-center">
            <div className="w-0.5 h-4 bg-border rounded-full" />
          </div>


          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-route-fastest/10 flex items-center justify-center transition-all group-focus-within:bg-route-fastest/20">
              <Navigation className="w-5 h-5 text-route-fastest" />
            </div>
            <Input
              type="text"
              placeholder="Destination"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="pl-16 h-14 text-lg border-2 border-border focus-visible:border-primary focus-visible:ring-0 rounded-xl bg-background"
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-14 text-lg font-semibold rounded-xl gradient-primary shadow-glow hover:shadow-[0_0_50px_hsl(var(--primary)/0.3)] transition-all duration-300 group"
        >
          Compare Routes
          <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </form> */}

            {/* Popular Routes */}
            <div className="mt-8 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">Popular routes</p>
                <div className="flex flex-wrap gap-2">
                    {["San Francisco → Los Angeles", "New York → Boston", "Seattle → Portland"].map(
                        (route) => (
                            <button
                                key={route}
                                onClick={() => {
                                    const [f, t] = route.split(" → ");
                                    setFrom(f);
                                    setTo(t);
                                }}
                                className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full transition-colors"
                            >
                                {route}
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchCard;