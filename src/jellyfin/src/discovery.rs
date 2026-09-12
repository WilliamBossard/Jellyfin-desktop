use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::net::{IpAddr, Ipv4Addr, SocketAddr, ToSocketAddrs, UdpSocket};
use std::time::{Duration, Instant};
use tracing::{debug, error, info};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
#[serde(rename_all = "PascalCase")]
pub struct DiscoveredServer {
    pub address: String,
    pub id: String,
    pub name: String,
    pub endpoint_address: Option<String>,
}

pub fn discover_servers(timeout_ms: u64) -> Vec<DiscoveredServer> {
    let timeout_ms = if timeout_ms < 500 { 1500 } else { timeout_ms };
    info!(target: "Discovery", "Starting local server discovery (timeout: {}ms)", timeout_ms);

    // 1. Enumerate local IPv4 interfaces via hostname
    let hostname = gethostname::gethostname().to_string_lossy().to_string();
    let local_ips: Vec<Ipv4Addr> = format!("{}:0", hostname)
        .to_socket_addrs()
        .map(|it| {
            it.filter_map(|sa| match sa.ip() {
                IpAddr::V4(v4) if !v4.is_loopback() => Some(v4),
                _ => None,
            })
            .collect()
        })
        .unwrap_or_default();

    debug!(target: "Discovery", "Local IPv4 interfaces: {:?}", local_ips);

    // 2. Prepare broadcast targets:
    // - Global broadcast: 255.255.255.255:7359
    // - Subnet-directed broadcasts: A.B.C.255:7359 for each local IPv4 interface
    let mut broadcast_targets = vec![
        SocketAddr::new(IpAddr::V4(Ipv4Addr::new(255, 255, 255, 255)), 7359),
    ];
    for ip in &local_ips {
        let octets = ip.octets();
        let subnet_bcast = SocketAddr::new(
            IpAddr::V4(Ipv4Addr::new(octets[0], octets[1], octets[2], 255)),
            7359,
        );
        if !broadcast_targets.contains(&subnet_bcast) {
            broadcast_targets.push(subnet_bcast);
        }
    }

    // 3. Bind sockets: 0.0.0.0 and each local interface IP
    let mut bind_ips = vec![Ipv4Addr::new(0, 0, 0, 0)];
    for ip in &local_ips {
        if !bind_ips.contains(ip) {
            bind_ips.push(*ip);
        }
    }

    let payload = b"Who is JellyfinServer?";
    let mut sockets = Vec::new();
    for ip in bind_ips {
        match UdpSocket::bind(SocketAddr::new(IpAddr::V4(ip), 0)) {
            Ok(s) => {
                let _ = s.set_broadcast(true);
                let _ = s.set_nonblocking(true);
                for target in &broadcast_targets {
                    let _ = s.send_to(payload, target);
                }
                sockets.push((ip, s));
            }
            Err(e) => {
                debug!(target: "Discovery", "Failed to bind socket on {}: {}", ip, e);
            }
        }
    }

    if sockets.is_empty() {
        error!(target: "Discovery", "Failed to bind any UDP socket for discovery");
        return vec![];
    }

    // 4. Non-blocking polling loop on all sockets until timeout_ms expires
    let start_time = Instant::now();
    let timeout = Duration::from_millis(timeout_ms);
    let mut server_map: HashMap<String, DiscoveredServer> = HashMap::new();
    let mut buf = [0u8; 4096];

    while start_time.elapsed() < timeout {
        for (ip, socket) in &sockets {
            loop {
                match socket.recv_from(&mut buf) {
                    Ok((size, src)) => {
                        let msg = String::from_utf8_lossy(&buf[..size]);
                        match serde_json::from_str::<DiscoveredServer>(&msg) {
                            Ok(mut server) => {
                                if server.endpoint_address.is_none() {
                                    server.endpoint_address = Some(src.to_string());
                                }
                                info!(
                                    target: "Discovery",
                                    "Discovered server '{}' at {} (from {}, on socket {})",
                                    server.name, server.address, src, ip
                                );
                                let key = if !server.id.is_empty() {
                                    server.id.clone()
                                } else {
                                    server.address.clone()
                                };
                                server_map.insert(key, server);
                            }
                            Err(e) => {
                                debug!(
                                    target: "Discovery",
                                    "Failed to parse discovery response from {}: {}", src, e
                                );
                            }
                        }
                    }
                    Err(ref e)
                        if e.kind() == std::io::ErrorKind::WouldBlock
                            || e.kind() == std::io::ErrorKind::TimedOut =>
                    {
                        break;
                    }
                    Err(e) => {
                        debug!(target: "Discovery", "Error reading socket on {}: {}", ip, e);
                        break;
                    }
                }
            }
        }
        std::thread::sleep(Duration::from_millis(25));
    }

    let results: Vec<DiscoveredServer> = server_map.into_values().collect();
    info!(target: "Discovery", "Discovery finished. Found {} server(s)", results.len());
    results
}
