import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Check, X, Edit } from "lucide-react";

interface UserUpload {
  id: string;
  user_id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  status: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
}

interface UserUploadCardProps {
  upload: UserUpload;
  categories: Category[];
  onApprove: (upload: UserUpload, categoryId: string) => void;
  onReject: (id: string) => void;
  onUpdate: (id: string, updates: Partial<UserUpload>) => void;
}

const UserUploadCard = ({ upload, categories, onApprove, onReject, onUpdate }: UserUploadCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(upload.title);
  const [editedDescription, setEditedDescription] = useState(upload.description || "");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSave = () => {
    onUpdate(upload.id, {
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  const handleApprove = () => {
    if (!selectedCategory) {
      alert("Please select a category first");
      return;
    }
    onApprove(upload, selectedCategory);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">
            {upload.status === "pending" ? "Pending Review" : upload.status === "approved" ? "Approved" : "Rejected"}
          </span>
          <span className="text-sm text-muted-foreground">
            {new Date(upload.created_at).toLocaleDateString()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <img
              src={upload.thumbnail_url}
              alt={upload.title}
              className="w-full aspect-video object-cover rounded"
            />
          </div>
          <div className="space-y-2">
            {isEditing ? (
              <>
                <div>
                  <Label htmlFor={`title-${upload.id}`}>Title</Label>
                  <Input
                    id={`title-${upload.id}`}
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`desc-${upload.id}`}>Description</Label>
                  <Textarea
                    id={`desc-${upload.id}`}
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-lg">{upload.title}</h3>
                <p className="text-sm text-muted-foreground">{upload.description}</p>
              </>
            )}
            
            {upload.status === "pending" && (
              <div>
                <Label htmlFor={`category-${upload.id}`}>Category</Label>
                <select
                  id={`category-${upload.id}`}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {upload.status === "pending" && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} size="sm">
                  Save Changes
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button onClick={handleApprove} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button onClick={() => onReject(upload.id)} variant="destructive" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserUploadCard;
