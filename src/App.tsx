import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { ImagePicker } from "./components/ImagePicker";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const convert = async () => {
    try {
      const msg = await invoke("convert_image", { input, output });
      alert(msg);
    } catch (err) {
      alert("Error: " + err);
    }
  };

  return (
    <div className="app-container">
      <h1>WebP Converter</h1>
      <ImagePicker onSelect={(path) => {
        setInput(path);
        setOutput(path.replace(/\.[^/.]+$/, ".webp"));
      }} />
      <input
        value={output}
        onChange={(e) => setOutput(e.target.value)}
        placeholder=".webp Image Path"
        className="input-field"
      />
      <button onClick={convert} className="convert-button">
        Convert to WebP
      </button>
    </div>
  );
}

export default App;