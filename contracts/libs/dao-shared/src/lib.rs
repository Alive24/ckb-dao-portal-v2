#![no_std]
#![cfg_attr(not(test), no_main)]

extern crate alloc;

pub mod generated;
pub mod error;
pub mod types;
pub mod cell_collector;
pub mod transaction_context;
pub mod validation;

// Re-export error types at crate root
pub use error::*;

// Re-export ckb_deterministic functionality
pub use ckb_deterministic::*;