import { open } from "@tauri-apps/plugin-dialog";
import { useState } from "react";
import "./ImagePicker.css";

interface ImagePickerProps {
  onSelect: (paths: string[]) => void;
}

export function ImagePicker({ onSelect }: ImagePickerProps) {

  // array of strings or null for the paths selected
  const [selected, setSelected] = useState<string[] | null>(null);

  const handleSelect = async () => {
    try {
      const paths = await open({
        multiple: true,
        filters: [{ 
          name: "Images", 
          extensions: ["jpg", "png", "webp", "jpeg"] 
        }],
      });

      if (!paths) {
          return;
      } else if (typeof paths === "string") {
        setSelected([paths]);
        onSelect([paths]);
        return;
      }
      setSelected(paths);
      onSelect(paths);
    } catch (error) {
      console.error("Error opening dialog:", error);
    }
  };

  return (
    <div className="image-picker">
      <button onClick={handleSelect}>Select Image</button>
      {selected && (
        <div>
          <p>Selected:</p>
          {selected.map((file, i) => <div key={i}>{file}</div>)}
        </div>
      )}
    </div>
  );
}