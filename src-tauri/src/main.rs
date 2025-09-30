// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// From lib.rs
fn main() 
{
    imgformatter_lib::run()
}