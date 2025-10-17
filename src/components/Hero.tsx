import { Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-featured.jpg";

const Hero = () => {
  return (
    <div className="relative h-[70vh] lg:h-[85vh] w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end lg:items-center pb-20 lg:pb-32 pl-4 lg:pl-16">
        <div className="max-w-2xl space-y-4 lg:space-y-6">
          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-war font-bold text-foreground leading-tight">
            The Last Guardian
          </h1>
          <p className="text-base lg:text-lg text-foreground/90 leading-relaxed">
            In a world torn by war, one warrior stands between chaos and salvation. 
            An epic tale of courage, sacrifice, and redemption that will keep you on the edge of your seat.
          </p>
          <div className="flex flex-wrap gap-3 lg:gap-4 pt-2">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 gap-2"
            >
              <Play className="h-5 w-5 fill-current" />
              Play Now
            </Button>
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-secondary/80 hover:bg-secondary text-secondary-foreground font-semibold px-8 gap-2 backdrop-blur-sm"
            >
              <Info className="h-5 w-5" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
