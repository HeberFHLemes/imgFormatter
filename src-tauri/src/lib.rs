use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandEvent;
use tauri::AppHandle;

#[tauri::command]
async fn convert_image(app: AppHandle, input: String, output: String) -> Result<String, String> 
{
    let sidecar_command = app
        .shell()
        .sidecar("cwebp")
        .map_err(|e| e.to_string())?
        .args([input.as_str(), "-o", output.as_str()]);

    let (mut rx, mut _child) = sidecar_command
        .spawn()
        .map_err(|e| format!("Failed to start process: {}", e))?;

    while let Some(event) = rx.recv().await 
    {
        match event 
        {
            CommandEvent::Stdout(line_bytes) => 
            {
                let line = String::from_utf8_lossy(&line_bytes);
                println!("stdout: {}", line);
            }
            CommandEvent::Stderr(line_bytes) => 
            {
                let line = String::from_utf8_lossy(&line_bytes);
                eprintln!("stderr: {}", line);
            }
            CommandEvent::Error(err) => 
            {
                return Err(format!("Process error: {}", err));
            }
            CommandEvent::Terminated(status) => 
            {
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
        .invoke_handler(tauri::generate_handler![convert_image])
        .run(tauri::generate_context!())
        .expect("Error running Tauri application");
}