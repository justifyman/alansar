import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

interface Announcement {
  id: string;
  title: string;
  content: string;
  position: number;
}

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("position");
    if (data) setAnnouncements(data);
  };

  if (announcements.length === 0) return null;

  return (
    <div className="px-4 lg:px-16 xl:px-32 py-8 lg:py-12">
      <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 font-war">
        ANNOUNCEMENTS
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-2">{announcement.title}</h3>
              <p className="text-sm text-muted-foreground">{announcement.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
