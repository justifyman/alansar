import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";

interface Profile {
  id: string;
  username: string;
  profile_picture_url: string | null;
}

interface UserUpload {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [uploads, setUploads] = useState<UserUpload[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    videoFile: null as File | null,
    thumbnailFile: null as File | null,
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);
    fetchProfile(session.user.id);
    fetchUploads(session.user.id);
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (data) setProfile(data);
  };

  const fetchUploads = async (userId: string) => {
    const { data } = await supabase
      .from("user_uploads")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (data) setUploads(data);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !uploadData.videoFile || !uploadData.thumbnailFile) {
      toast({
        title: "Error",
        description: "Please fill in all fields and select both video and thumbnail files",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const videoExt = uploadData.videoFile.name.split(".").pop();
      const videoFileName = `${user.id}/${Date.now()}.${videoExt}`;
      
      const { error: videoError } = await supabase.storage
        .from("user-videos")
        .upload(videoFileName, uploadData.videoFile);

      if (videoError) throw videoError;

      const thumbExt = uploadData.thumbnailFile.name.split(".").pop();
      const thumbFileName = `${user.id}/${Date.now()}.${thumbExt}`;
      
      const { error: thumbError } = await supabase.storage
        .from("user-thumbnails")
        .upload(thumbFileName, uploadData.thumbnailFile);

      if (thumbError) throw thumbError;

      const { data: { publicUrl: videoUrl } } = supabase.storage
        .from("user-videos")
        .getPublicUrl(videoFileName);

      const { data: { publicUrl: thumbUrl } } = supabase.storage
        .from("user-thumbnails")
        .getPublicUrl(thumbFileName);

      const { error: insertError } = await supabase
        .from("user_uploads")
        .insert({
          user_id: user.id,
          title: uploadData.title,
          description: uploadData.description,
          video_url: videoUrl,
          thumbnail_url: thumbUrl,
          status: "pending",
        });

      if (insertError) throw insertError;

      toast({
        title: "Success!",
        description: "Your video has been submitted for review.",
      });

      setUploadData({ title: "", description: "", videoFile: null, thumbnailFile: null });
      fetchUploads(user.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user || !profile) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={() => {}} />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.profile_picture_url && (
                <img
                  src={profile.profile_picture_url}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover mx-auto"
                />
              )}
              <div>
                <Label>Username</Label>
                <p className="text-foreground mt-1">{profile.username}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-foreground mt-1">{user.email}</p>
              </div>
              <Button onClick={handleLogout} variant="outline" className="w-full">
                Logout
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload Video</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={uploadData.description}
                    onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="video">Video File</Label>
                  <Input
                    id="video"
                    type="file"
                    accept="video/*"
                    onChange={(e) => setUploadData({ ...uploadData, videoFile: e.target.files?.[0] || null })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail Image</Label>
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadData({ ...uploadData, thumbnailFile: e.target.files?.[0] || null })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Uploading..." : "Submit for Review"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>My Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            {uploads.length === 0 ? (
              <p className="text-muted-foreground">No uploads yet</p>
            ) : (
              <div className="space-y-4">
                {uploads.map((upload) => (
                  <div key={upload.id} className="border border-border rounded-lg p-4">
                    <h3 className="font-semibold">{upload.title}</h3>
                    <p className="text-sm text-muted-foreground">{upload.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        upload.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                        upload.status === 'rejected' ? 'bg-red-500/20 text-red-500' :
                        'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {upload.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(upload.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
