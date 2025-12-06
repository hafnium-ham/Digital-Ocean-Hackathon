import { Search, User, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  variant?: "default" | "transparent";
}

const Header = ({ variant = "default" }: HeaderProps) => {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        variant === "transparent"
          ? "bg-transparent"
          : "bg-foreground/95 backdrop-blur-xl border-b border-foreground/10"
      }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-primary-foreground">
            WanderLens.ai
          </span>
        </div>

        {/* Search Bar
        <div className="hidden md:flex items-center max-w-md flex-1 mx-12">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search destinations..."
              className="w-full pl-10 bg-foreground/10 border-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-primary/50"
            />
          </div>
        </div> */}

        {/* User Avatar */}
        {/* <Avatar className="h-9 w-9 ring-2 ring-primary/30 transition-all hover:ring-primary/60 cursor-pointer">
          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
          <AvatarFallback className="bg-primary text-primary-foreground">
            JD
          </AvatarFallback>
        </Avatar> */}
      </div>
    </header>
  );
};

export default Header;