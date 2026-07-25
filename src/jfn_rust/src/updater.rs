use std::fs::File;
use std::process::Command;
use serde::Deserialize;
use windows::Win32::UI::WindowsAndMessaging::{MessageBoxW, MB_YESNO, MB_ICONINFORMATION, IDYES};
use windows::core::HSTRING;

#[derive(Deserialize, Debug)]
struct Asset {
    name: String,
    browser_download_url: String,
}

#[derive(Deserialize, Debug)]
struct Release {
    tag_name: String,
    assets: Vec<Asset>,
}

pub fn check_and_update(repo_name: &str) {
    let current_version = env!("CARGO_PKG_VERSION");
    let repo = repo_name.to_string();
    
    std::thread::spawn(move || {
        let request = ureq::get(&format!("https://api.github.com/repos/{}/releases/latest", repo))
            .header("User-Agent", "Jellium-Desktop-Updater");
            
        let response = match request.call() {
            Ok(r) => r,
            Err(e) => {
                tracing::error!("Failed to check for updates: {:?}", e);
                return;
            }
        };
        
        let release: Release = match serde_json::from_reader(response.into_body().into_reader()) {
            Ok(r) => r,
            Err(e) => {
                tracing::error!("Failed to parse GitHub release JSON: {:?}", e);
                return;
            }
        };
        
        // Simple version check (assumes tags like "v1.0.0" or "1.0.0")
        let tag = release.tag_name.trim_start_matches('v');
        if tag == current_version {
            tracing::info!("Already up to date.");
            return;
        }
        
        let exe_asset = release.assets.iter().find(|a| a.name.ends_with(".exe"));
        let asset = match exe_asset {
            Some(a) => a,
            None => {
                tracing::warn!("Update found but no .exe asset available.");
                return;
            }
        };
        
        let message = format!("Une nouvelle version ({}) est disponible !\nVoulez-vous la télécharger et l'installer maintenant ?", release.tag_name);
        let title = "Mise à jour disponible";
        
        unsafe {
            let result = MessageBoxW(
                None,
                &HSTRING::from(message),
                &HSTRING::from(title),
                MB_YESNO | MB_ICONINFORMATION
            );
            
            if result == IDYES {
                let temp_dir = std::env::temp_dir();
                let file_path = temp_dir.join(&asset.name);
                
                let dl_req = ureq::get(&asset.browser_download_url).header("User-Agent", "Jellium-Desktop-Updater");
                if let Ok(dl_res) = dl_req.call() {
                    let mut reader = dl_res.into_body().into_reader();
                    if let Ok(mut file) = File::create(&file_path) {
                        if std::io::copy(&mut reader, &mut file).is_ok() {
                            // Launch installer silently and exit
                            Command::new(&file_path)
                                .arg("/SILENT")
                                .spawn()
                                .ok();
                            std::process::exit(0);
                        }
                    }
                }
            }
        }
    });
}


