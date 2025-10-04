import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { FaFileImage } from "react-icons/fa";
import { ImagePicker } from "./components/ImagePicker";
import "./App.css";

function App() {
  const [inputs, setInputs] = useState<string[] | null>(null);
  const [outputs, setOutputs] = useState<string[] | null>(null);

  const convert = async () => {
    try {
      const msg = await invoke("convert_multiple_images", { inputs, outputs });
      alert(msg);
    } catch (err) {
      alert("Error: " + err);
    }
  };

  return (
    <div className="app-container">
      <h1>imgFormatter</h1>
      <p className="subheading">Convert images to WebP format</p>

      <ImagePicker
        onSelect={(paths) => {
          setInputs(paths);
          setOutputs(paths.map((input) => input.replace(/\.\w+$/, ".webp")));
        }}
      />

      {outputs && (
        <div className="file-path-preview">
          <p>Output files:</p>
          {outputs.map((path, i) => (
            <div key={i} className="file-path">
              <FaFileImage style={{ marginRight: 8 }} />
              {path}
            </div>
          ))}
        </div>
      )}

      <button onClick={convert} className="convert-button">
        Convert to WebP
      </button>
    </div>
  );
}

export default App;