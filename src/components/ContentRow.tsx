import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoCard from "./VideoCard";
import { useRef, useState } from "react";

interface ContentRowProps {
  title: string;
  videos: Array<{ image: string; title: string; videoUrl: string; description?: string; onPlay: () => void }>;
}

const ContentRow = ({ title, videos }: ContentRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      
      setTimeout(() => {
        if (scrollRef.current) {
          setShowLeftArrow(scrollRef.current.scrollLeft > 0);
          setShowRightArrow(
            scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth
          );
        }
      }, 300);
    }
  };

  return (
    <div className="group relative mb-6 sm:mb-8 lg:mb-12">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 sm:mb-4 px-4 lg:px-16">
        {title}
      </h2>
      
      <div className="relative px-4 lg:px-16">
        <div className="pb-6 sm:pb-8 lg:pb-12 border-b border-white/20">
          {/* Left Arrow */}
          {showLeftArrow && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background/90 backdrop-blur-sm h-12 w-12 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {/* Scrollable Content */}
          <div
            ref={scrollRef}
            className="flex gap-2 sm:gap-3 lg:gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {videos.map((video, index) => (
              <VideoCard 
                key={index} 
                image={video.image} 
                title={video.title}
                description={video.description}
                videoUrl={video.videoUrl}
                onPlay={video.onPlay}
              />
            ))}
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background/90 backdrop-blur-sm h-12 w-12 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentRow;
