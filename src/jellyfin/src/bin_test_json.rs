fn main() {
    let servers = vec![
        jfn_jellyfin::discovery::DiscoveredServer {
            address: "http://192.168.1.123:8096".to_string(),
            id: "c820167198df4f3fa843707e290efcc7".to_string(),
            name: "Jellyfin".to_string(),
            endpoint_address: Some("192.168.1.123:7359".to_string()),
        }
    ];
    let json = serde_json::to_string(&servers).unwrap();
    println!("JSON: {}", json);
}
