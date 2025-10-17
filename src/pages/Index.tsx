import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ContentRow from "@/components/ContentRow";
import Announcements from "@/components/Announcements";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Category {
  id: string;
  name: string;
  position: number;
}

interface Video {
  id: string;
  title: string;
  description: string;
  category_id: string;
  video_url: string;
  thumbnail_url: string;
}

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: cats } = await supabase
      .from("categories")
      .select("*")
      .order("position");
    const { data: vids } = await supabase.from("videos").select("*");
    
    if (cats) setCategories(cats);
    if (vids) setVideos(vids);
  };

  const getVideosByCategory = (categoryId: string) => {
    const categoryVideos = videos.filter((v) => v.category_id === categoryId);
    if (searchQuery) {
      return categoryVideos.filter((v) =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return categoryVideos;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePlayVideo = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
    setIsVideoDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={handleSearch} />
      <main>
        <Hero />
        <Announcements />
        <div className="relative z-10 pb-16" data-categories>
          {categories.map((category) => {
            const categoryVideos = getVideosByCategory(category.id);
            if (categoryVideos.length === 0) return null;
            return (
              <div key={category.id} id={`category-${category.id}`}>
                <ContentRow
                  title={category.name}
                  videos={categoryVideos.map((v) => ({
                    image: v.thumbnail_url,
                    title: v.title,
                    videoUrl: v.video_url,
                    onPlay: () => handlePlayVideo(v.video_url),
                  }))}
                />
              </div>
            );
          })}
        </div>
      </main>

      {/* Video Dialog */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
          <div className="w-full h-full">
            {selectedVideo && (
              <video
                src={selectedVideo}
                controls
                autoPlay
                className="w-full h-full object-contain bg-black"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
