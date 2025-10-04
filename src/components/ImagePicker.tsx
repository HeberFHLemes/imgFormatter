import { open } from "@tauri-apps/plugin-dialog";
import { useState } from "react";
import { FaFileImage } from "react-icons/fa";
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
      <button onClick={handleSelect}>Select Image(s)</button>

      {selected && selected.length > 0 && (
        <div className="file-path-preview">
          <p>Selected files:</p>
          {selected.map((file, i) => (
            <div key={i} className="file-path" title={file}>
              <FaFileImage style={{ marginRight: 8 }} />
              {file}
            </div>
          ))}
          <p className="hint-text">
            Output files will have the same name, but with a <code>.webp</code> extension.
          </p>
        </div>
      )}
    </div>
  );
}