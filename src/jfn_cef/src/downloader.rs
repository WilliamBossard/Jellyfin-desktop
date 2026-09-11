use std::fs::File;
use std::io::{Read, Write};
use std::path::PathBuf;
use std::sync::{Mutex, OnceLock, mpsc};
use std::thread;

use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct DownloadRecord {
    pub filename: String,
    pub media_path: String,
    pub metadata_path: String,
    pub artwork_path: String,
    pub status: String,
    #[serde(default)]
    pub downloaded_bytes: u64,
    #[serde(default)]
    pub total_bytes: Option<u64>,
}

#[derive(Deserialize)]
struct SubtitleDownload {
    url: String,
    filename: String,
}

struct DownloadJob {
    url: String,
    filename: String,
    metadata_json: String,
    artwork_url: String,
    subtitles_json: String,
}

static MANIFEST_LOCK: OnceLock<Mutex<()>> = OnceLock::new();
static DOWNLOAD_QUEUE: OnceLock<mpsc::Sender<DownloadJob>> = OnceLock::new();

pub fn safe_relative_path(filename: &str) -> PathBuf {
    filename
        .split(['/', '\\'])
        .filter(|part| !part.is_empty() && *part != "." && *part != "..")
        .map(|part| part.replace([':', '*', '?', '"', '<', '>', '|'], "_"))
        .fold(PathBuf::new(), |mut path, part| {
            path.push(part);
            path
        })
}

pub fn normalized_filename(filename: &str) -> String {
    safe_relative_path(filename)
        .to_string_lossy()
        .replace('\\', "/")
}

fn api_token(url: &str) -> Option<&str> {
    if let Some((_, value)) = url.split_once("api_key=") {
        let token = value.split('&').next().unwrap_or_default();
        if !token.is_empty() {
            return Some(token);
        }
    }
    if let Some((_, value)) = url.split_once("token=") {
        let token = value.split('&').next().unwrap_or_default();
        if !token.is_empty() {
            return Some(token);
        }
    }
    None
}

pub fn get_jellyfin_download_dir() -> PathBuf {
    #[cfg(target_os = "windows")]
    {
        if let Ok(local_app_data) = std::env::var("LOCALAPPDATA") {
            return PathBuf::from(local_app_data).join("jellyfin-desktop").join("downloads");
        }
    }
    #[cfg(not(target_os = "windows"))]
    {
        if let Ok(home) = std::env::var("HOME") {
            return PathBuf::from(home).join(".local").join("share").join("jellyfin-desktop").join("downloads");
        }
    }
    PathBuf::from(".").join("downloads")
}

fn manifest_path(download_dir: &PathBuf) -> PathBuf {
    download_dir.join("downloads.json")
}

fn update_manifest(download_dir: &PathBuf, record: DownloadRecord) {
    let lock = MANIFEST_LOCK.get_or_init(|| Mutex::new(()));
    let Ok(_guard) = lock.lock() else { return };
    let path = manifest_path(download_dir);
    let mut records = std::fs::read_to_string(&path)
        .ok()
        .and_then(|json| serde_json::from_str::<Vec<DownloadRecord>>(&json).ok())
        .unwrap_or_default();
    if let Some(existing) = records.iter_mut().find(|entry| entry.filename == record.filename) {
        *existing = record;
    } else {
        records.push(record);
    }
    let unique_id = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_nanos())
        .unwrap_or(0);
    let temp_path = download_dir.join(format!("downloads.json.{unique_id}.part"));
    if let Ok(json) = serde_json::to_string_pretty(&records) {
        if std::fs::write(&temp_path, json).is_ok() {
            let _ = std::fs::rename(&temp_path, &path);
        }
        let _ = std::fs::remove_file(temp_path);
    }
}

pub fn list_downloads_json() -> String {
    let download_dir = get_jellyfin_download_dir();
    let lock = MANIFEST_LOCK.get_or_init(|| Mutex::new(()));
    let Ok(_guard) = lock.lock() else { return "[]".to_string() };
    let records = std::fs::read_to_string(manifest_path(&download_dir))
        .ok()
        .and_then(|json| serde_json::from_str::<Vec<DownloadRecord>>(&json).ok())
        .unwrap_or_default();
    let records = records
        .into_iter()
        .map(|record| {
            let metadata = std::fs::read_to_string(&record.metadata_path).unwrap_or_default();
            serde_json::json!({
                "filename": record.filename,
                "media_path": record.media_path,
                "metadata_path": record.metadata_path,
                "artwork_path": record.artwork_path,
                "status": record.status,
                "downloaded_bytes": record.downloaded_bytes,
                "total_bytes": record.total_bytes,
                "metadata": metadata,
            })
        })
        .collect::<Vec<_>>();
    serde_json::to_string(&records).unwrap_or_else(|_| "[]".to_string())
}

pub fn get_artwork_bytes(filename: &str) -> Option<Vec<u8>> {
    let download_dir = get_jellyfin_download_dir();
    let rel = safe_relative_path(filename);
    let artwork_path = download_dir.join(format!("{}.jpg", rel.display()));
    if let Ok(bytes) = std::fs::read(&artwork_path) {
        return Some(bytes);
    }
    let direct_path = download_dir.join(&rel);
    if let Ok(bytes) = std::fs::read(&direct_path) {
        return Some(bytes);
    }
    let folder_poster = direct_path.join("poster.jpg");
    if let Ok(bytes) = std::fs::read(&folder_poster) {
        return Some(bytes);
    }
    // Try lookup in manifest
    let lock = MANIFEST_LOCK.get_or_init(|| Mutex::new(()));
    let Ok(_guard) = lock.lock() else { return None };
    let norm = normalized_filename(filename);
    let records = std::fs::read_to_string(manifest_path(&download_dir))
        .ok()
        .and_then(|json| serde_json::from_str::<Vec<DownloadRecord>>(&json).ok())?;
    let record = records.iter().find(|r| r.filename == norm || r.filename == filename)?;
    std::fs::read(&record.artwork_path).ok()
}

pub fn download_exists(filename: &str) -> bool {
    let download_dir = get_jellyfin_download_dir();
    let rel_path = safe_relative_path(filename);
    let dest_path = download_dir.join(&rel_path);
    if dest_path.exists() {
        return true;
    }
    let path = manifest_path(&download_dir);
    let lock = MANIFEST_LOCK.get_or_init(|| Mutex::new(()));
    let Ok(_guard) = lock.lock() else { return false };
    let norm = normalized_filename(filename);
    std::fs::read_to_string(path)
        .ok()
        .and_then(|json| serde_json::from_str::<Vec<DownloadRecord>>(&json).ok())
        .is_some_and(|records| {
            records
                .iter()
                .any(|record| {
                    (record.filename == norm || record.filename == filename)
                        && (record.status == "complete"
                            || record.status == "downloading"
                            || record.status == "pending")
                })
        })
}

fn is_in_manifest(download_dir: &PathBuf, filename: &str) -> bool {
    let lock = MANIFEST_LOCK.get_or_init(|| Mutex::new(()));
    let Ok(_guard) = lock.lock() else { return false };
    let path = manifest_path(download_dir);
    std::fs::read_to_string(&path)
        .ok()
        .and_then(|json| serde_json::from_str::<Vec<DownloadRecord>>(&json).ok())
        .is_some_and(|records| records.iter().any(|r| r.filename == filename))
}

fn has_media_files(dir: &std::path::Path) -> bool {
    let Ok(entries) = std::fs::read_dir(dir) else { return false };
    for entry in entries.flatten() {
        let path = entry.path();
        if path.is_dir() {
            if has_media_files(&path) {
                return true;
            }
        } else if let Some(ext) = path.extension().and_then(|e| e.to_str()) {
            let lower = ext.to_lowercase();
            if lower == "mkv" || lower == "mp4" || lower == "avi" || lower == "webm" || lower == "ts" || lower == "part" {
                return true;
            }
        }
    }
    false
}

fn clean_empty_media_dirs(start_dir: &std::path::Path, root_dir: &std::path::Path) {
    let mut current = start_dir.to_path_buf();
    while current.starts_with(root_dir) && current != root_dir {
        if current.parent() == Some(root_dir) {
            let name = current.file_name().and_then(|n| n.to_str()).unwrap_or("");
            if name.eq_ignore_ascii_case("films") || name.eq_ignore_ascii_case("series") {
                break;
            }
        }
        if !has_media_files(&current) {
            let _ = std::fs::remove_dir_all(&current);
        } else {
            break;
        }
        if let Some(parent) = current.parent() {
            current = parent.to_path_buf();
        } else {
            break;
        }
    }
}

pub fn delete_download(filename: String) -> bool {
    let download_dir = get_jellyfin_download_dir();
    let rel = safe_relative_path(&filename);
    let norm = normalized_filename(&filename);
    let target_path = download_dir.join(&rel);

    if target_path == download_dir {
        return false;
    }

    if target_path.is_dir() {
        let prefix_slash = format!("{norm}/");
        let lock = MANIFEST_LOCK.get_or_init(|| Mutex::new(()));
        let Ok(_guard) = lock.lock() else { return false };
        let path = manifest_path(&download_dir);
        if let Some(mut records) = std::fs::read_to_string(&path)
            .ok()
            .and_then(|json| serde_json::from_str::<Vec<DownloadRecord>>(&json).ok())
        {
            records.retain(|entry| {
                entry.filename != norm && !entry.filename.starts_with(&prefix_slash)
            });
            let unique_id = std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .map(|d| d.as_nanos())
                .unwrap_or(0);
            let temp_path = download_dir.join(format!("downloads.json.{unique_id}.part"));
            if let Ok(json) = serde_json::to_string_pretty(&records) {
                if std::fs::write(&temp_path, json).is_ok() {
                    let _ = std::fs::rename(&temp_path, &path);
                }
                let _ = std::fs::remove_file(temp_path);
            }
        }

        let _ = std::fs::remove_dir_all(&target_path);

        if let Some(parent) = target_path.parent() {
            clean_empty_media_dirs(parent, &download_dir);
        }
        return true;
    }

    if let Some(parent) = target_path.parent() {
        let stem_str = target_path.file_stem().and_then(|s| s.to_str()).unwrap_or("");
        let prefix_dot = format!("{stem_str}.");
        if let Ok(entries) = std::fs::read_dir(parent) {
            for entry in entries.flatten() {
                let p = entry.path();
                if p.is_file() {
                    if let Some(name) = p.file_name().and_then(|n| n.to_str()) {
                        if name == stem_str || name.starts_with(&prefix_dot) {
                            let _ = std::fs::remove_file(&p);
                        }
                    }
                }
            }
        }
    }

    let paths = [
        target_path.clone(),
        download_dir.join(format!("{}.metadata.json", rel.display())),
        download_dir.join(format!("{}.metadata.json.part", rel.display())),
        download_dir.join(format!("{}.jpg", rel.display())),
        download_dir.join(format!("{}.jpg.part", rel.display())),
        download_dir.join(format!("{}.part", rel.display())),
    ];
    for path in paths {
        let _ = std::fs::remove_file(path);
    }
    let lock = MANIFEST_LOCK.get_or_init(|| Mutex::new(()));
    let Ok(_guard) = lock.lock() else { return false };
    let path = manifest_path(&download_dir);
    let Some(mut records) = std::fs::read_to_string(&path)
        .ok()
        .and_then(|json| serde_json::from_str::<Vec<DownloadRecord>>(&json).ok())
    else {
        return false;
    };
    records.retain(|entry| entry.filename != norm && entry.filename != filename);
    let unique_id = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_nanos())
        .unwrap_or(0);
    let temp_path = download_dir.join(format!("downloads.json.{unique_id}.part"));
    if let Ok(json) = serde_json::to_string_pretty(&records) {
        if std::fs::write(&temp_path, json).is_ok() {
            let _ = std::fs::rename(&temp_path, &path);
        }
        let _ = std::fs::remove_file(temp_path);
    }

    if let Some(parent) = target_path.parent() {
        clean_empty_media_dirs(parent, &download_dir);
    }

    true
}

fn download_single_image(
    agent: &ureq::Agent,
    url: &str,
    dest: &std::path::Path,
    token: Option<&str>,
) -> bool {
    if dest.exists() || url.is_empty() {
        return true;
    }
    let part_path = PathBuf::from(format!("{}.part", dest.display()));
    let mut request = agent.get(url);
    if let Some(t) = token {
        request = request
            .header("X-Emby-Token", t)
            .header("X-MediaBrowser-Token", t)
            .header("Authorization", format!("MediaBrowser Token=\"{t}\""));
    }
    let Ok(response) = request.call() else { return false };
    let mut reader = response.into_body().into_reader();
    let Ok(mut file) = File::create(&part_path) else { return false };
    let mut buffer = [0u8; 64 * 1024];
    let mut failed = false;
    loop {
        match reader.read(&mut buffer) {
            Ok(0) => break,
            Ok(n) => {
                if file.write_all(&buffer[..n]).is_err() {
                    failed = true;
                    break;
                }
            }
            Err(_) => {
                failed = true;
                break;
            }
        }
    }
    if !failed {
        let _ = std::fs::rename(&part_path, dest);
        true
    } else {
        let _ = std::fs::remove_file(&part_path);
        false
    }
}

fn process_download_job(job: DownloadJob) {
    let download_dir = get_jellyfin_download_dir();
    let norm_name = normalized_filename(&job.filename);
    let rel_path = safe_relative_path(&job.filename);
    let dest_path = download_dir.join(&rel_path);
    let part_path = download_dir.join(format!("{}.part", rel_path.display()));
    let metadata_path = download_dir.join(format!("{}.metadata.json", rel_path.display()));
    let metadata_part_path = download_dir.join(format!("{}.metadata.json.part", rel_path.display()));
    let artwork_path = download_dir.join(format!("{}.jpg", rel_path.display()));
    let artwork_part_path = download_dir.join(format!("{}.jpg.part", rel_path.display()));

    // If user cancelled / deleted before worker started, abort
    if !is_in_manifest(&download_dir, &norm_name) {
        return;
    }

    jfn_logging::log(
        jfn_logging::CATEGORY_CEF,
        jfn_logging::LEVEL_INFO,
        &format!("Worker processing download: {norm_name}"),
    );

    update_manifest(
        &download_dir,
        DownloadRecord {
            filename: norm_name.clone(),
            media_path: dest_path.to_string_lossy().into_owned(),
            metadata_path: metadata_path.to_string_lossy().into_owned(),
            artwork_path: artwork_path.to_string_lossy().into_owned(),
            status: "downloading".to_string(),
            downloaded_bytes: 0,
            total_bytes: None,
        },
    );

    let agent = ureq::Agent::new_with_defaults();

    // 1. Metadata
    if !job.metadata_json.is_empty() {
        if let Err(e) = std::fs::write(&metadata_part_path, &job.metadata_json)
            .and_then(|_| std::fs::rename(&metadata_part_path, &metadata_path))
        {
            jfn_logging::log(
                jfn_logging::CATEGORY_CEF,
                jfn_logging::LEVEL_WARN,
                &format!("Erreur sauvegarde metadata: {e}"),
            );
            let _ = std::fs::remove_file(&metadata_part_path);
        }
    }

    // 2. Artwork
    if !job.artwork_url.is_empty() && !artwork_path.exists() {
        let mut request = agent.get(&job.artwork_url);
        if let Some(token) = api_token(&job.artwork_url) {
            request = request.header("X-Emby-Token", token);
            request = request.header("X-MediaBrowser-Token", token);
            request = request.header("Authorization", format!("MediaBrowser Token=\"{token}\""));
        }
        if let Ok(response) = request.call() {
            let mut reader = response.into_body().into_reader();
            if let Ok(mut file) = File::create(&artwork_part_path) {
                let mut buffer = [0u8; 64 * 1024];
                let mut failed = false;
                loop {
                    match reader.read(&mut buffer) {
                        Ok(0) => break,
                        Ok(n) => {
                            if file.write_all(&buffer[..n]).is_err() {
                                failed = true;
                                break;
                            }
                        }
                        Err(_) => {
                            failed = true;
                            break;
                        }
                    }
                }
                if !failed {
                    let _ = std::fs::rename(&artwork_part_path, &artwork_path);
                } else {
                    let _ = std::fs::remove_file(&artwork_part_path);
                }
            }
        }
    }

    // 2b. Series and Season Posters (if this item is an episode in a series folder)
    if let Ok(meta) = serde_json::from_str::<serde_json::Value>(&job.metadata_json) {
        if let Some(series_id) = meta.get("SeriesId").and_then(|v| v.as_str()) {
            if let Some(parent) = dest_path.parent() {
                let is_season = parent.file_name()
                    .and_then(|n| n.to_str())
                    .map_or(false, |n| {
                        let lower = n.to_lowercase();
                        lower.starts_with("saison") || lower.starts_with("season")
                    });
                let (season_dir, series_dir) = if is_season {
                    (Some(parent), parent.parent().unwrap_or(parent))
                } else {
                    (None, parent)
                };

                let base_url = job.url.split_once("/Items/")
                    .or_else(|| job.url.split_once("/Audio/"))
                    .map(|(base, _)| base);

                if let Some(base) = base_url {
                    let token = api_token(&job.url);

                    // 1. Series Poster
                    let series_poster = series_dir.join("poster.jpg");
                    if !series_poster.exists() {
                        let series_tag = meta.get("SeriesPrimaryImageTag").and_then(|v| v.as_str());
                        let tag_param = series_tag.map(|t| format!("?tag={t}")).unwrap_or_default();
                        let poster_url = format!("{base}/Items/{series_id}/Images/Primary{tag_param}");
                        download_single_image(&agent, &poster_url, &series_poster, token);
                    }

                    // 2. Season Poster
                    if let Some(s_dir) = season_dir {
                        let season_poster = s_dir.join("poster.jpg");
                        if !season_poster.exists() {
                            if let Some(season_id) = meta.get("SeasonId").and_then(|v| v.as_str()) {
                                let season_tag = meta.get("SeasonPrimaryImageTag").and_then(|v| v.as_str());
                                let tag_param = season_tag.map(|t| format!("?tag={t}")).unwrap_or_default();
                                let season_url = format!("{base}/Items/{season_id}/Images/Primary{tag_param}");
                                download_single_image(&agent, &season_url, &season_poster, token);
                            }
                        }
                    }
                }
            }
        }
    }

    // 3. Subtitles
    if let Ok(subtitles) = serde_json::from_str::<Vec<SubtitleDownload>>(&job.subtitles_json) {
        for subtitle in subtitles {
            let subtitle_path = download_dir.join(safe_relative_path(&subtitle.filename));
            if let Some(parent) = subtitle_path.parent() {
                let _ = std::fs::create_dir_all(parent);
            }
            let subtitle_part = PathBuf::from(format!("{}.part", subtitle_path.display()));
            let mut request = agent.get(&subtitle.url);
            let token_opt = api_token(&subtitle.url).or_else(|| api_token(&job.url));
            if let Some(token) = token_opt {
                request = request.header("X-Emby-Token", token);
                request = request.header("X-MediaBrowser-Token", token);
                request = request.header("Authorization", format!("MediaBrowser Token=\"{token}\""));
            }
            jfn_logging::log(
                jfn_logging::CATEGORY_CEF,
                jfn_logging::LEVEL_INFO,
                &format!("[Downloader] Téléchargement sous-titre: {} -> {}", subtitle.url, subtitle_path.display()),
            );
            let Ok(response) = request.call() else {
                jfn_logging::log(
                    jfn_logging::CATEGORY_CEF,
                    jfn_logging::LEVEL_WARN,
                    &format!("[Downloader] Échec requête HTTP sous-titre: {}", subtitle.url),
                );
                continue;
            };
            let mut reader = response.into_body().into_reader();
            let Ok(mut file) = File::create(&subtitle_part) else { continue };
            let mut buffer = [0u8; 16 * 1024];
            let mut failed = false;
            loop {
                match reader.read(&mut buffer) {
                    Ok(0) => break,
                    Ok(n) if file.write_all(&buffer[..n]).is_ok() => {}
                    _ => {
                        failed = true;
                        break;
                    }
                }
            }
            if !failed {
                let _ = std::fs::rename(&subtitle_part, &subtitle_path);
                jfn_logging::log(
                    jfn_logging::CATEGORY_CEF,
                    jfn_logging::LEVEL_INFO,
                    &format!("[Downloader] Sous-titre enregistré avec succès: {}", subtitle_path.display()),
                );
            } else {
                let _ = std::fs::remove_file(subtitle_part);
            }
        }
    }

    // 4. Media file
    if !is_in_manifest(&download_dir, &norm_name) {
        let _ = std::fs::remove_file(&part_path);
        return;
    }

    let mut request = agent.get(&job.url);
    if let Some(token) = api_token(&job.url) {
        request = request.header("X-Emby-Token", token);
        request = request.header("X-MediaBrowser-Token", token);
        request = request.header("Authorization", format!("MediaBrowser Token=\"{token}\""));
    }

    let resp = match request.call() {
        Ok(r) => r,
        Err(e) => {
            jfn_logging::log(
                jfn_logging::CATEGORY_CEF,
                jfn_logging::LEVEL_ERROR,
                &format!("Erreur HTTP telechargement {norm_name}: {e}"),
            );
            update_manifest(
                &download_dir,
                DownloadRecord {
                    filename: norm_name.clone(),
                    media_path: dest_path.to_string_lossy().into_owned(),
                    metadata_path: metadata_path.to_string_lossy().into_owned(),
                    artwork_path: artwork_path.to_string_lossy().into_owned(),
                    status: "error".to_string(),
                    downloaded_bytes: 0,
                    total_bytes: None,
                },
            );
            return;
        }
    };

    let total_bytes = resp
        .headers()
        .get("content-length")
        .and_then(|value| value.to_str().ok()?.parse::<u64>().ok());

    let mut reader = resp.into_body().into_reader();
    let mut file = match File::create(&part_path) {
        Ok(f) => f,
        Err(e) => {
            jfn_logging::log(
                jfn_logging::CATEGORY_CEF,
                jfn_logging::LEVEL_ERROR,
                &format!("Erreur creation fichier part: {e}"),
            );
            update_manifest(
                &download_dir,
                DownloadRecord {
                    filename: norm_name.clone(),
                    media_path: dest_path.to_string_lossy().into_owned(),
                    metadata_path: metadata_path.to_string_lossy().into_owned(),
                    artwork_path: artwork_path.to_string_lossy().into_owned(),
                    status: "error".to_string(),
                    downloaded_bytes: 0,
                    total_bytes: None,
                },
            );
            return;
        }
    };

    let mut buffer = [0u8; 64 * 1024];
    let mut downloaded_bytes = 0u64;
    let mut last_manifest_update = std::time::Instant::now();

    loop {
        match reader.read(&mut buffer) {
            Ok(0) => break,
            Ok(n) => {
                if file.write_all(&buffer[..n]).is_err() {
                    jfn_logging::log(
                        jfn_logging::CATEGORY_CEF,
                        jfn_logging::LEVEL_ERROR,
                        &format!("Erreur ecriture part: {norm_name}"),
                    );
                    let _ = std::fs::remove_file(&part_path);
                    update_manifest(
                        &download_dir,
                        DownloadRecord {
                            filename: norm_name.clone(),
                            media_path: dest_path.to_string_lossy().into_owned(),
                            metadata_path: metadata_path.to_string_lossy().into_owned(),
                            artwork_path: artwork_path.to_string_lossy().into_owned(),
                            status: "error".to_string(),
                            downloaded_bytes,
                            total_bytes,
                        },
                    );
                    return;
                }
                downloaded_bytes += n as u64;

                if last_manifest_update.elapsed() >= std::time::Duration::from_millis(250) {
                    if !is_in_manifest(&download_dir, &norm_name) {
                        let _ = std::fs::remove_file(&part_path);
                        return;
                    }
                    update_manifest(
                        &download_dir,
                        DownloadRecord {
                            filename: norm_name.clone(),
                            media_path: dest_path.to_string_lossy().into_owned(),
                            metadata_path: metadata_path.to_string_lossy().into_owned(),
                            artwork_path: artwork_path.to_string_lossy().into_owned(),
                            status: "downloading".to_string(),
                            downloaded_bytes,
                            total_bytes,
                        },
                    );
                    last_manifest_update = std::time::Instant::now();
                }
            }
            Err(e) => {
                jfn_logging::log(
                    jfn_logging::CATEGORY_CEF,
                    jfn_logging::LEVEL_ERROR,
                    &format!("Erreur lecture flux {norm_name}: {e}"),
                );
                let _ = std::fs::remove_file(&part_path);
                update_manifest(
                    &download_dir,
                    DownloadRecord {
                        filename: norm_name.clone(),
                        media_path: dest_path.to_string_lossy().into_owned(),
                        metadata_path: metadata_path.to_string_lossy().into_owned(),
                        artwork_path: artwork_path.to_string_lossy().into_owned(),
                        status: "error".to_string(),
                        downloaded_bytes,
                        total_bytes,
                    },
                );
                return;
            }
        }
    }

    if let Err(e) = std::fs::rename(&part_path, &dest_path) {
        jfn_logging::log(
            jfn_logging::CATEGORY_CEF,
            jfn_logging::LEVEL_ERROR,
            &format!("Erreur renommage part -> dest {norm_name}: {e}"),
        );
        return;
    }

    jfn_logging::log(
        jfn_logging::CATEGORY_CEF,
        jfn_logging::LEVEL_INFO,
        &format!("Telechargement termine avec succes: {norm_name}"),
    );

    update_manifest(
        &download_dir,
        DownloadRecord {
            filename: norm_name,
            media_path: dest_path.to_string_lossy().into_owned(),
            metadata_path: metadata_path.to_string_lossy().into_owned(),
            artwork_path: artwork_path.to_string_lossy().into_owned(),
            status: "complete".to_string(),
            downloaded_bytes,
            total_bytes,
        },
    );
}

fn init_download_worker() -> mpsc::Sender<DownloadJob> {
    let (sender, receiver) = mpsc::channel::<DownloadJob>();
    thread::spawn(move || {
        while let Ok(job) = receiver.recv() {
            process_download_job(job);
        }
    });
    sender
}

pub fn download_file(
    url: String,
    filename: String,
    metadata_json: String,
    artwork_url: String,
    subtitles_json: String,
) {
    let download_dir = get_jellyfin_download_dir();
    let _ = std::fs::create_dir_all(&download_dir);

    let norm_name = normalized_filename(&filename);
    let rel_path = safe_relative_path(&filename);
    let dest_path = download_dir.join(&rel_path);
    let metadata_path = download_dir.join(format!("{}.metadata.json", rel_path.display()));
    let artwork_path = download_dir.join(format!("{}.jpg", rel_path.display()));

    if download_exists(&norm_name) || download_exists(&filename) {
        jfn_logging::log(
            jfn_logging::CATEGORY_CEF,
            jfn_logging::LEVEL_INFO,
            &format!("Telechargement deja present ou en cours, ignore: {norm_name}"),
        );
        return;
    }

    if let Some(parent) = dest_path.parent() {
        let _ = std::fs::create_dir_all(parent);
    }

    // Immediately save metadata so pending items have their full metadata for grouping and UI
    if !metadata_json.is_empty() {
        let _ = std::fs::write(&metadata_path, &metadata_json);
    }

    // Immediately register in manifest as pending so it appears right away in UI
    update_manifest(
        &download_dir,
        DownloadRecord {
            filename: norm_name.clone(),
            media_path: dest_path.to_string_lossy().into_owned(),
            metadata_path: metadata_path.to_string_lossy().into_owned(),
            artwork_path: artwork_path.to_string_lossy().into_owned(),
            status: "pending".to_string(),
            downloaded_bytes: 0,
            total_bytes: None,
        },
    );

    let sender = DOWNLOAD_QUEUE.get_or_init(init_download_worker);
    let _ = sender.send(DownloadJob {
        url,
        filename,
        metadata_json,
        artwork_url,
        subtitles_json,
    });
}

pub fn open_downloads_dir() {
    let download_dir = get_jellyfin_download_dir();
    let _ = std::fs::create_dir_all(&download_dir);
    if let Some(p) = crate::platform_ops::ops() {
        p.open_path(&download_dir);
    }
}
