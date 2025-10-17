import { Play, Info } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VideoCardProps {
  image: string;
  title: string;
  description?: string;
  videoUrl?: string;
  onPlay?: () => void;
}

const VideoCard = ({ image, title, description, onPlay }: VideoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer flex-shrink-0 w-64 lg:w-72 transition-all duration-300 hover:scale-105 hover:z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Hover Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-primary/90 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300" onClick={onPlay}>
            <Play className="h-6 w-6 text-primary-foreground fill-current" />
          </div>
        </div>

        {/* More Info Icon */}
        {description && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                  <Info className="h-4 w-4 text-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {/* Title on hover */}
      <div className={`mt-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
      </div>
    </div>
  );
};

export default VideoCard;
