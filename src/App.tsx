import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

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
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Original Image Path"
        className="input-field"
      />
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