import { open } from "@tauri-apps/plugin-dialog";
import { useState } from "react";
import "./ImagePicker.css";

interface ImagePickerProps {
  onSelect: (path: string) => void;
}

export function ImagePicker({ onSelect }: ImagePickerProps) {
  const [selected, setSelected] = useState("");

  const handleSelect = async () => {
    try {
      const path = await open({
        multiple: false,
        filters: [{ name: "Images", extensions: ["jpg", "png", "webp", "jpeg"] }],
      });

      if (!path) {
        // user canceled
        return;
      }

      if (Array.isArray(path)) {
        // for now, not multiple files
        const first = path[0];
        setSelected(first);
        onSelect(first);
      } else {
        // string case
        setSelected(path);
        onSelect(path);
      }
    } catch (error) {
      console.error("Error opening dialog:", error);
    }
  };

  return (
    <div className="image-picker">
      <button onClick={handleSelect}>Select Image</button>
      {selected && <p>Selected: {selected}</p>}
    </div>
  );
}