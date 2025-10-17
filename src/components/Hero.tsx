import { useState, useEffect } from "react";
import { Play, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface HeroData {
  id: string;
  title: string;
  description: string;
  background_image_url: string;
  video_url: string | null;
}

const Hero = () => {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    const { data } = await supabase.from("hero").select("*").single();
    if (data) setHeroData(data);
  };

  const handlePlayNow = () => {
    if (heroData?.video_url) {
      setShowVideo(true);
    }
  };

  const handleSeeMore = () => {
    const categoriesSection = document.querySelector('[data-categories]');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!heroData) return null;

  return (
    <>
      <div className="relative h-[70vh] lg:h-[85vh] w-full overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroData.background_image_url})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-end lg:items-center pb-20 lg:pb-16 pl-4 lg:pl-16">
          <div className="max-w-2xl space-y-4 lg:space-y-6 mt-15">
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-war font-bold text-foreground leading-tight">
              {heroData.title}
            </h1>
            <p className="text-base lg:text-lg text-foreground/90 leading-relaxed">
              {heroData.description}
            </p>
            <div className="flex flex-wrap gap-3 lg:gap-4 pt-2">
              <Button 
                size="lg" 
                onClick={handlePlayNow}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 gap-2"
              >
                <Play className="h-5 w-5 fill-current" />
                Play Now
              </Button>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={handleSeeMore}
                className="bg-secondary/80 hover:bg-secondary text-secondary-foreground font-semibold px-8 gap-2 backdrop-blur-sm"
              >
                <ChevronDown className="h-5 w-5" />
                See More
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showVideo} onOpenChange={setShowVideo}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black">
          <div className="relative w-full h-[95vh]">
            <video
              src={heroData.video_url || ''}
              controls
              autoPlay
              className="w-full h-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Hero;
