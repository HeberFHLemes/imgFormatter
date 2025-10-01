import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
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
      <h1>WebP Converter</h1>
      <ImagePicker onSelect={(paths) => {
        setInputs(paths);
        setOutputs(paths.map((input) => input.replace(/\.\w+$/, ".webp")));
      }} />
      {outputs && (
        <div className="output-preview">
          <p>Output files:</p>
          {outputs.map((path, i) => (
            <div key={i}>{path}</div>
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