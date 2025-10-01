use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandEvent;
use tauri::AppHandle;

// For parallel execution - maybe later
// use futures::future::join_all;

#[tauri::command]
#[allow(dead_code)]
async fn convert_multiple_images(app: AppHandle, inputs: Vec<String>, outputs: Vec<String>) -> Result<String, String> {
    if inputs.len() != outputs.len() { // just in case
        let err_msg = format!(
            "❌ Mismatched input/output lengths: {} inputs, {} outputs",
            inputs.len(),
            outputs.len()
        );
        eprintln!("{}", err_msg);
        return Err(err_msg);
    }

    /*
     * Sequential processing for simplicity (for now).
     * It can be changed to parallel with futures::future::join_all if needed.
     * Loops through each input/output pair and processes them one by one.
     * Uses into_iter() to take ownership and consume the input vectors.
    */
    for (input, output) in inputs.into_iter().zip(outputs.into_iter()) {
        match convert_image(app.clone(), input, output).await {
            Ok(msg) => println!("✅ Converted: {}", msg),
            Err(err) => eprintln!("❌ Error: {}", err),
        }
    }

    Ok("All images processed.".into())
}

async fn convert_image(app: AppHandle, input: String, output: String) -> Result<String, String> {
    let sidecar_command = app
        .shell()
        .sidecar("cwebp")
        .map_err(|e| e.to_string())?
        .args([input.as_str(), "-o", output.as_str()]);

    let (mut rx, mut _child) = sidecar_command
        .spawn()
        .map_err(|e| format!("Failed to start process: {}", e))?;

    while let Some(event) = rx.recv().await {
        match event {
            CommandEvent::Stdout(line_bytes) => {
                let line = String::from_utf8_lossy(&line_bytes);
                println!("stdout: {}", line);
            }
            CommandEvent::Stderr(line_bytes) => {
                let line = String::from_utf8_lossy(&line_bytes);
                eprintln!("stderr: {}", line);
            }
            CommandEvent::Error(err) => {
                return Err(format!("Process error: {}", err));
            }
            CommandEvent::Terminated(status) => {
                if status.code == Some(0) {
                    return Ok("Image converted successfully.".into());
                } else {
                    return Err(format!("Process exited with code: {:?}", status.code));
                }
            }
            _ => {}
        }
    }
    Err("Process terminated unexpectedly.".into())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            convert_multiple_images
        ])
        .run(tauri::generate_context!())
        .expect("Error running Tauri application");
}