import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Trash2, Edit } from "lucide-react";

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

interface HeroData {
  id: string;
  title: string;
  description: string;
  background_image_url: string;
  video_url: string | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  
  // Form states
  const [newCategoryName, setNewCategoryName] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  
  // Hero form states
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [heroBackgroundFile, setHeroBackgroundFile] = useState<File | null>(null);
  const [heroVideoFile, setHeroVideoFile] = useState<File | null>(null);

  const ADMIN_PASSWORD_HASH = "alansaradmins26";

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth");
    if (auth === ADMIN_PASSWORD_HASH) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD_HASH) {
      sessionStorage.setItem("adminAuth", ADMIN_PASSWORD_HASH);
      setIsAuthenticated(true);
      fetchData();
      toast({ title: "Login successful" });
    } else {
      toast({ title: "Invalid password", variant: "destructive" });
    }
  };

  const fetchData = async () => {
    const { data: cats } = await supabase.from("categories").select("*").order("position");
    const { data: vids } = await supabase.from("videos").select("*");
    const { data: hero } = await supabase.from("hero").select("*").single();
    
    if (cats) setCategories(cats);
    if (vids) setVideos(vids);
    if (hero) {
      setHeroData(hero);
      setHeroTitle(hero.title);
      setHeroDescription(hero.description);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("categories").insert({
      name: newCategoryName,
      position: categories.length,
    });
    if (error) {
      toast({ title: "Error creating category", variant: "destructive" });
    } else {
      toast({ title: "Category created" });
      setNewCategoryName("");
      fetchData();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting category", variant: "destructive" });
    } else {
      toast({ title: "Category deleted" });
      fetchData();
    }
  };

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmitVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !thumbnailFile) {
      toast({ title: "Please select both video and thumbnail files", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const videoUrl = await uploadFile(videoFile, "videos");
      const thumbnailUrl = await uploadFile(thumbnailFile, "thumbnails");

      if (editingVideo) {
        const { error } = await supabase
          .from("videos")
          .update({
            title: videoTitle,
            description: videoDescription,
            category_id: selectedCategory,
            video_url: videoUrl,
            thumbnail_url: thumbnailUrl,
          })
          .eq("id", editingVideo.id);
        if (error) throw error;
        toast({ title: "Video updated" });
        setEditingVideo(null);
      } else {
        const { error } = await supabase.from("videos").insert({
          title: videoTitle,
          description: videoDescription,
          category_id: selectedCategory,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
        });
        if (error) throw error;
        toast({ title: "Video uploaded" });
      }

      setVideoTitle("");
      setVideoDescription("");
      setSelectedCategory("");
      setVideoFile(null);
      setThumbnailFile(null);
      fetchData();
    } catch (error) {
      toast({ title: "Error uploading video", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    setVideoTitle(video.title);
    setVideoDescription(video.description);
    setSelectedCategory(video.category_id);
  };

  const handleDeleteVideo = async (id: string) => {
    const { error } = await supabase.from("videos").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting video", variant: "destructive" });
    } else {
      toast({ title: "Video deleted" });
      fetchData();
    }
  };

  const handleUpdateHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroData) return;

    setUploading(true);
    try {
      let backgroundUrl = heroData.background_image_url;
      let videoUrl = heroData.video_url;

      if (heroBackgroundFile) {
        backgroundUrl = await uploadFile(heroBackgroundFile, "thumbnails");
      }
      if (heroVideoFile) {
        videoUrl = await uploadFile(heroVideoFile, "videos");
      }

      const { error } = await supabase
        .from("hero")
        .update({
          title: heroTitle,
          description: heroDescription,
          background_image_url: backgroundUrl,
          video_url: videoUrl,
        })
        .eq("id", heroData.id);

      if (error) throw error;

      toast({ title: "Hero updated successfully" });
      setHeroBackgroundFile(null);
      setHeroVideoFile(null);
      fetchData();
    } catch (error) {
      toast({ title: "Error updating hero", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-war font-bold">Admin Panel</h1>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/")}>Back to Home</Button>
            <Button
              variant="destructive"
              onClick={() => {
                sessionStorage.removeItem("adminAuth");
                setIsAuthenticated(false);
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList>
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Edit Hero Section</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateHero} className="space-y-4">
                  <div>
                    <Label htmlFor="heroTitle">Featured Title</Label>
                    <Input
                      id="heroTitle"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="heroDescription">Description</Label>
                    <Textarea
                      id="heroDescription"
                      value={heroDescription}
                      onChange={(e) => setHeroDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="heroBackground">Background Image</Label>
                    <Input
                      id="heroBackground"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setHeroBackgroundFile(e.target.files?.[0] || null)}
                    />
                    {heroData?.background_image_url && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Current: {heroData.background_image_url.split('/').pop()}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="heroVideo">Play Now Video</Label>
                    <Input
                      id="heroVideo"
                      type="file"
                      accept="video/*"
                      onChange={(e) => setHeroVideoFile(e.target.files?.[0] || null)}
                    />
                    {heroData?.video_url && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Current: {heroData.video_url.split('/').pop()}
                      </p>
                    )}
                  </div>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? "Updating..." : "Update Hero"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{editingVideo ? "Edit Video" : "Upload New Video"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitVideo} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={videoDescription}
                      onChange={(e) => setVideoDescription(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="video">Video File</Label>
                    <Input
                      id="video"
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                      required={!editingVideo}
                    />
                  </div>
                  <div>
                    <Label htmlFor="thumbnail">Thumbnail Image</Label>
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                      required={!editingVideo}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={uploading}>
                      {uploading ? "Uploading..." : editingVideo ? "Update Video" : "Upload Video"}
                    </Button>
                    {editingVideo && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingVideo(null);
                          setVideoTitle("");
                          setVideoDescription("");
                          setSelectedCategory("");
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manage Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="w-24 h-16 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-semibold">{video.title}</h3>
                          <p className="text-sm text-muted-foreground">{video.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditVideo(video)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteVideo(video.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Category</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCategory} className="flex gap-2">
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category name"
                    required
                  />
                  <Button type="submit">Add Category</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manage Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <span>{category.name}</span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
