import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  position: number;
}

const Navbar = ({ onSearch }: { onSearch?: (query: string) => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("position");
    if (data) setCategories(data);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : "bg-gradient-to-b from-background/80 to-transparent"
      }`}
    >
      <div className="w-full px-4 lg:px-16">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo and Nav */}
          <div className="flex items-center gap-8">
            <Link to="/">
              <img 
                src="/logo.png" 
                alt="AlAnsarMedia" 
                className="h-8 lg:h-10 w-auto object-contain"
              />
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">
                Home
              </Link>
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`#category-${category.id}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {category.name}
                </a>
              ))}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {showSearch ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 lg:w-64"
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                    onSearch?.("");
                  }}
                >
                  ×
                </Button>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:text-primary"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
