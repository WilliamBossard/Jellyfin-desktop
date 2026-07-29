use std::fs::File;
use std::process::Command;
use std::sync::OnceLock;
use serde::Deserialize;

#[derive(Deserialize, Debug, Clone)]
struct Asset {
    name: String,
    browser_download_url: String,
}

#[derive(Deserialize, Debug, Clone)]
struct Release {
    tag_name: String,
    assets: Vec<Asset>,
}

/// Information about an available update - populated once by the background check.
#[derive(Clone, Debug)]
pub struct UpdateInfo {
    pub version: String,
    pub download_url: String,
    pub asset_name: String,
}

static PENDING_UPDATE: OnceLock<UpdateInfo> = OnceLock::new();

/// Returns any pending update detected since startup.
pub fn pending_update() -> Option<&'static UpdateInfo> {
    PENDING_UPDATE.get()
}

/// Start a background thread that queries GitHub and stores the result.
/// The web layer injects the dialog via JS once the browser is ready.
pub fn check_and_update(repo_name: &str) {
    let current_version = env!("CARGO_PKG_VERSION");
    let repo = repo_name.to_string();

    std::thread::spawn(move || {
        let request = ureq::get(&format!("https://api.github.com/repos/{}/releases/latest", repo))
            .header("User-Agent", "Jellyfin-Desktop-Updater");

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

        // Strip leading "v" from tag (e.g. "v1.1.0" -> "1.1.0")
        let tag = release.tag_name.trim_start_matches('v');
        if tag == current_version {
            tracing::info!("Jellyfin Desktop is up to date (v{}).", current_version);
            return;
        }

        // Find the Windows .exe installer asset
        let exe_asset = release.assets.iter().find(|a| a.name.ends_with(".exe"));
        let asset = match exe_asset {
            Some(a) => a,
            None => {
                tracing::warn!("Update v{} found but no .exe asset available.", tag);
                return;
            }
        };

        tracing::info!("Update available: v{} (current: v{})", tag, current_version);
        let _ = PENDING_UPDATE.set(UpdateInfo {
            version: tag.to_string(),
            download_url: asset.browser_download_url.clone(),
            asset_name: asset.name.clone(),
        });
    });
}

/// Download and install the update. Called when the user confirms in the in-app dialog.
pub fn perform_update(url: &str, asset_name: &str) {
    let url = url.to_string();
    let asset_name = asset_name.to_string();

    std::thread::spawn(move || {
        let dl_req = ureq::get(&url).header("User-Agent", "Jellyfin-Desktop-Updater");
        if let Ok(dl_res) = dl_req.call() {
            let file_path = std::env::temp_dir().join(&asset_name);
            let mut reader = dl_res.into_body().into_reader();
            if let Ok(mut file) = File::create(&file_path) {
                if std::io::copy(&mut reader, &mut file).is_ok() {
                    tracing::info!("Launching installer: {:?}", file_path);
                    Command::new(&file_path).arg("/SILENT").spawn().ok();
                    std::process::exit(0);
                }
            }
        }
        tracing::error!("Failed to download or save the update.");
    });
}