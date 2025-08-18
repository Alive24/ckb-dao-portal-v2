//! Validation rules for DAO operations

use alloc::vec::Vec;
use ckb_deterministic::validation::{TransactionValidationRules, CellCountConstraint};
use crate::error::Error;
use crate::types::*;

/// Validate treasury operations
pub fn validate_treasury_operation(
    signatures: &[Vec<u8>],
    required_threshold: u8,
    authorized_signers: &[[u8; 32]],
) -> Result<(), Error> {
    if signatures.len() < required_threshold as usize {
        return Err(Error::InsufficientSignatures);
    }
    
    // Additional validation logic for treasury operations
    Ok(())
}

/// Validate proposal submission
pub fn validate_proposal_submission(
    deposit: u128,
    min_deposit: u128,
    proposer_lock_hash: &[u8; 32],
) -> Result<(), Error> {
    if deposit < min_deposit {
        return Err(Error::InsufficientDeposit);
    }
    
    // Additional validation logic for proposals
    Ok(())
}

/// Validate voting operation
pub fn validate_vote(
    proposal_status: ProposalStatus,
    current_block: u64,
    voting_start: u64,
    voting_end: u64,
    voter_lock_hash: &[u8; 32],
    has_voted: bool,
) -> Result<(), Error> {
    if proposal_status != ProposalStatus::Active {
        return Err(Error::ProposalNotActive);
    }
    
    if current_block < voting_start {
        return Err(Error::VotingPeriodNotStarted);
    }
    
    if current_block > voting_end {
        return Err(Error::VotingPeriodEnded);
    }
    
    if has_voted {
        return Err(Error::AlreadyVoted);
    }
    
    Ok(())
}

/// Validate delegation operation
pub fn validate_delegation(
    representative_status: RepresentativeStatus,
    delegation_cap: Option<u128>,
    current_delegated: u128,
    new_delegation: u128,
) -> Result<(), Error> {
    if representative_status != RepresentativeStatus::Active {
        return Err(Error::RepresentativeNotActive);
    }
    
    if let Some(cap) = delegation_cap {
        if current_delegated + new_delegation > cap {
            return Err(Error::DelegationCapExceeded);
        }
    }
    
    Ok(())
}

/// Create validation rules for DAO treasury operations
pub fn treasury_validation_rules() -> TransactionValidationRules {
    TransactionValidationRules::new(b"treasury_operation".to_vec())
        .with_arguments(2) // Expected number of arguments
        .with_custom_cell(
            "treasury",
            CellCountConstraint::exactly(1), // Exactly one treasury input
            CellCountConstraint::exactly(1), // Exactly one treasury output
        )
}

/// Create validation rules for proposal operations
pub fn proposal_validation_rules() -> TransactionValidationRules {
    TransactionValidationRules::new(b"proposal_operation".to_vec())
        .with_arguments(2)
        .with_custom_cell(
            "proposal",
            CellCountConstraint::at_most(1),  // At most one proposal input
            CellCountConstraint::exactly(1),   // Exactly one proposal output
        )
}