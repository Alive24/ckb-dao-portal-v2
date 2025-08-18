//! Common types and constants for DAO contracts

use alloc::vec::Vec;
use ckb_std::ckb_types::bytes::Bytes;
use ckb_std::ckb_types::packed::Script;

/// DAO Protocol Version
pub const DAO_VERSION: u32 = 1;

/// Proposal Status
#[repr(u8)]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ProposalStatus {
    Draft = 0,
    Active = 1,
    Passed = 2,
    Rejected = 3,
    Executed = 4,
    Cancelled = 5,
}

impl From<u8> for ProposalStatus {
    fn from(value: u8) -> Self {
        match value {
            0 => Self::Draft,
            1 => Self::Active,
            2 => Self::Passed,
            3 => Self::Rejected,
            4 => Self::Executed,
            5 => Self::Cancelled,
            _ => Self::Draft,
        }
    }
}

/// Representative Status
#[repr(u8)]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum RepresentativeStatus {
    Active = 0,
    Inactive = 1,
    Suspended = 2,
    Retired = 3,
}

impl From<u8> for RepresentativeStatus {
    fn from(value: u8) -> Self {
        match value {
            0 => Self::Active,
            1 => Self::Inactive,
            2 => Self::Suspended,
            3 => Self::Retired,
            _ => Self::Inactive,
        }
    }
}

/// Vote Choice
#[repr(u8)]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum VoteChoice {
    No = 0,
    Yes = 1,
    Abstain = 2,
}

impl From<u8> for VoteChoice {
    fn from(value: u8) -> Self {
        match value {
            0 => Self::No,
            1 => Self::Yes,
            2 => Self::Abstain,
            _ => Self::Abstain,
        }
    }
}

/// Delegation Type
#[repr(u8)]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum DelegationType {
    Full = 0,
    Partial = 1,
    TopicSpecific = 2,
}

impl From<u8> for DelegationType {
    fn from(value: u8) -> Self {
        match value {
            0 => Self::Full,
            1 => Self::Partial,
            2 => Self::TopicSpecific,
            _ => Self::Full,
        }
    }
}

/// Execution Action Type
#[repr(u8)]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ExecutionActionType {
    TreasuryTransfer = 0,
    ParameterChange = 1,
    ContractUpgrade = 2,
}

impl From<u8> for ExecutionActionType {
    fn from(value: u8) -> Self {
        match value {
            0 => Self::TreasuryTransfer,
            1 => Self::ParameterChange,
            2 => Self::ContractUpgrade,
            _ => Self::TreasuryTransfer,
        }
    }
}

/// Address Binding Status
#[repr(u8)]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum BindingStatus {
    Pending = 0,
    Verified = 1,
    Revoked = 2,
}

impl From<u8> for BindingStatus {
    fn from(value: u8) -> Self {
        match value {
            0 => Self::Pending,
            1 => Self::Verified,
            2 => Self::Revoked,
            _ => Self::Pending,
        }
    }
}

/// Vote weight calculation constants
pub mod weight_constants {
    /// Base weight multiplier (10000 = 1x)
    pub const BASE_MULTIPLIER: u32 = 10000;
    
    /// Maximum UTXO age multiplier (20000 = 2x)
    pub const MAX_AGE_MULTIPLIER: u32 = 20000;
    
    /// Age blocks for 1% bonus (approximately 1 day)
    pub const AGE_BONUS_BLOCKS: u64 = 8640;
    
    /// Maximum age for bonus (approximately 1 year)
    pub const MAX_AGE_BLOCKS: u64 = 3153600;
    
    /// Nervos DAO bonus multiplier (15000 = 1.5x)
    pub const NERVOS_DAO_MULTIPLIER: u32 = 15000;
}

/// Treasury constants
pub mod treasury_constants {
    /// Minimum signatures for normal operations
    pub const MIN_SIGNATURES: u8 = 3;
    
    /// Maximum signatures (total guardians)
    pub const MAX_GUARDIANS: u8 = 10;
    
    /// Default time lock period (approximately 7 days)
    pub const DEFAULT_TIMELOCK_BLOCKS: u64 = 60480;
    
    /// Emergency time lock period (approximately 1 day)
    pub const EMERGENCY_TIMELOCK_BLOCKS: u64 = 8640;
}

/// Proposal constants
pub mod proposal_constants {
    /// Minimum proposal deposit (1000 CKB)
    pub const MIN_PROPOSAL_DEPOSIT: u128 = 1000_00000000;
    
    /// Default voting period (approximately 14 days)
    pub const DEFAULT_VOTING_PERIOD: u64 = 120960;
    
    /// Default execution delay (approximately 2 days)
    pub const DEFAULT_EXECUTION_DELAY: u64 = 17280;
    
    /// Default quorum threshold (10% of total supply)
    pub const DEFAULT_QUORUM_THRESHOLD: u8 = 10;
    
    /// Default approval threshold (60%)
    pub const DEFAULT_APPROVAL_THRESHOLD: u8 = 60;
}

/// Helper functions for type conversions
pub mod helpers {
    use super::*;
    use ckb_std::ckb_types::prelude::*;
    
    /// Convert Script to lock hash (blake2b hash)
    pub fn script_to_lock_hash(script: &Script) -> [u8; 32] {
        let mut hash = [0u8; 32];
        let script_hash = script.calc_script_hash();
        hash.copy_from_slice(script_hash.as_slice());
        hash
    }
    
    /// Calculate vote weight based on amount and factors
    pub fn calculate_vote_weight(
        amount: u128,
        utxo_age_blocks: u64,
        has_nervos_dao: bool,
    ) -> u128 {
        let mut weight = amount;
        
        // Apply UTXO age multiplier (up to 2x)
        let age_multiplier = calculate_age_multiplier(utxo_age_blocks);
        weight = weight * age_multiplier as u128 / weight_constants::BASE_MULTIPLIER as u128;
        
        // Apply Nervos DAO bonus (1.5x)
        if has_nervos_dao {
            weight = weight * weight_constants::NERVOS_DAO_MULTIPLIER as u128 
                / weight_constants::BASE_MULTIPLIER as u128;
        }
        
        weight
    }
    
    /// Calculate age multiplier based on UTXO age
    pub fn calculate_age_multiplier(age_blocks: u64) -> u32 {
        if age_blocks >= weight_constants::MAX_AGE_BLOCKS {
            weight_constants::MAX_AGE_MULTIPLIER
        } else {
            let bonus_periods = age_blocks / weight_constants::AGE_BONUS_BLOCKS;
            let bonus = bonus_periods as u32 * 100; // 1% per period
            weight_constants::BASE_MULTIPLIER + bonus.min(
                weight_constants::MAX_AGE_MULTIPLIER - weight_constants::BASE_MULTIPLIER
            )
        }
    }
}