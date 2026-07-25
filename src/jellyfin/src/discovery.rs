use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::net::UdpSocket;
use std::time::{Duration, Instant};
use tracing::{error, info};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
#[serde(rename_all = "PascalCase")]
pub struct DiscoveredServer {
    pub address: String,
    pub id: String,
    pub name: String,
    pub endpoint_address: Option<String>,
}

pub fn discover_servers(timeout_ms: u64) -> Vec<DiscoveredServer> {
    info!(target: "Discovery", "Starting local server discovery (timeout: {}ms)", timeout_ms);
    
    let mut servers = HashSet::new();
    let socket = match UdpSocket::bind("0.0.0.0:0") {
        Ok(s) => s,
        Err(e) => {
            error!(target: "Discovery", "Failed to bind UDP socket: {}", e);
            return vec![];
        }
    };

    if let Err(e) = socket.set_broadcast(true) {
        error!(target: "Discovery", "Failed to set broadcast on socket: {}", e);
        return vec![];
    }

    if let Err(e) = socket.set_read_timeout(Some(Duration::from_millis(timeout_ms))) {
        error!(target: "Discovery", "Failed to set read timeout on socket: {}", e);
        return vec![];
    }

    let payload = b"Who is JellyfinServer?";
    let target_addr = "255.255.255.255:7359";

    if let Err(e) = socket.send_to(payload, target_addr) {
        error!(target: "Discovery", "Failed to send broadcast packet: {}", e);
        return vec![];
    }

    let start_time = Instant::now();
    let timeout = Duration::from_millis(timeout_ms);
    let mut buf = [0; 4096];

    while start_time.elapsed() < timeout {
        let remaining = timeout.saturating_sub(start_time.elapsed());
        if remaining.is_zero() {
            break;
        }
        let _ = socket.set_read_timeout(Some(remaining));

        match socket.recv_from(&mut buf) {
            Ok((size, src)) => {
                let msg = String::from_utf8_lossy(&buf[..size]);
                match serde_json::from_str::<DiscoveredServer>(&msg) {
                    Ok(mut server) => {
                        if server.endpoint_address.is_none() {
                            server.endpoint_address = Some(src.to_string());
                        }
                        info!(target: "Discovery", "Found server: {} at {}", server.name, server.address);
                        servers.insert(server);
                    }
                    Err(e) => {
                        error!(target: "Discovery", "Failed to parse discovery response from {}: {}", src, e);
                    }
                }
            }
            Err(e) => {
                let kind = e.kind();
                if kind == std::io::ErrorKind::WouldBlock || kind == std::io::ErrorKind::TimedOut {
                    break;
                }
                error!(target: "Discovery", "Error receiving UDP packet: {}", e);
                break;
            }
        }
    }

    servers.into_iter().collect()
}
