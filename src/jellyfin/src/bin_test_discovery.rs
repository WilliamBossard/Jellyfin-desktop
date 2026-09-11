fn main() {
    println!("Testing jfn_jellyfin::discovery::discover_servers...");
    let servers = jfn_jellyfin::discovery::discover_servers(1500);
    println!("Result servers count: {}", servers.len());
    for s in &servers {
        println!("Server found: {:?}", s);
    }
}
