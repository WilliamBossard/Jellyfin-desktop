fn main() {
    println!("Start discovery...");
    let servers = jfn_jellyfin::discovery::discover_servers(2000);
    println!("Found: {:?}", servers);
}
