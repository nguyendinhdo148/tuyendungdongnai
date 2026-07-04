import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Upload, User } from "lucide-react";
import { useRef, useState } from "react";

interface ProfilePhotoSelectorProps {
  image: File | string | null;
  setImage: (image: File | null) => void;
  preview: string;
  setPreview: (preview: string) => void;
}

const ProfilePhotoSelector = ({
  image,
  setImage,
  preview,
  setPreview,
}: ProfilePhotoSelectorProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage(file);

      const preview = URL.createObjectURL(file);
      if (setPreview) {
        setPreview(preview);
      }
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);

    if (setPreview) {
      setPreview("");
    }
  };

  const onChooseFile = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="flex justify-center mb-6">
      <Input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div className="size-20 flex items-center justify-center bg-purple-50 rounded-full relative cursor-pointer">
          <User className="size-8 text-purple-500" />

          <Button
            onClick={onChooseFile}
            type="button"
            className="size-8 flex items-center bg-linear-to-r from-purple-500/85 to-purple-700 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
          >
            <Upload />
          </Button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview || previewUrl || ""}
            alt="profile photo"
            className="size-20 rounded-full object-cover"
          />
          <Button
            onClick={handleRemoveImage}
            type="button"
            className="size-8 flex items-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
          >
            <Trash2 />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
