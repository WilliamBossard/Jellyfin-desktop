fn main() {
    println!("Reload: {}", cef::sys::cef_menu_id_t::MENU_ID_RELOAD as i32);
    println!("Copy: {}", cef::sys::cef_menu_id_t::MENU_ID_COPY as i32);
}
