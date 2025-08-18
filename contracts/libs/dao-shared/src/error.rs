//! Error types for DAO smart contracts

use ckb_std::error::SysError;

/// Error codes for DAO contracts
#[repr(i8)]
#[derive(Debug, PartialEq, Clone)]
pub enum Error {
    // CKB System Errors (1-10)
    IndexOutOfBound = 1,
    ItemMissing = 2,
    LengthNotEnough = 3,
    Encoding = 4,
    
    // Treasury Errors (11-20)
    InsufficientSignatures = 11,
    UnauthorizedSigner = 12,
    TimeLockNotExpired = 13,
    InsufficientFunds = 14,
    AllocationExceeded = 15,
    EmergencyModeActive = 16,
    InvalidWithdrawalAmount = 17,
    
    // Proposal Errors (21-30)
    ProposalNotActive = 21,
    ProposalAlreadyExecuted = 22,
    VotingPeriodEnded = 23,
    VotingPeriodNotStarted = 24,
    InsufficientDeposit = 25,
    QuorumNotMet = 26,
    ApprovalThresholdNotMet = 27,
    ExecutionDeadlinePassed = 28,
    InvalidProposalStatus = 29,
    
    // Representative Errors (31-40)
    RepresentativeNotActive = 31,
    DelegationCapExceeded = 32,
    UnauthorizedRepresentative = 33,
    InsufficientStake = 34,
    RepresentativeSuspended = 35,
    InvalidDelegationType = 36,
    
    // Voting Errors (41-50)
    AlreadyVoted = 41,
    InvalidVoteChoice = 42,
    NoVotingPower = 43,
    InvalidVoteWeight = 44,
    DelegationConflict = 45,
    VoteNotFound = 46,
    
    // Address Binding Errors (51-60)
    InvalidWebAuthnCredential = 51,
    BindingAlreadyExists = 52,
    BindingNotVerified = 53,
    InvalidBindingProof = 54,
    BindingRevoked = 55,
    
    // Cell Classification Errors (61-70)
    UnidentifiedCells = 61,
    InvalidCellType = 62,
    CellCountMismatch = 63,
    InvalidCodeHash = 64,
    
    // Validation Errors (71-80)
    InvalidArguments = 71,
    InvalidCellData = 72,
    ValidationFailed = 73,
    DependencyMissing = 74,
    
    // Unknown error
    Unknown = -1,
}

impl From<SysError> for Error {
    fn from(err: SysError) -> Self {
        match err {
            SysError::IndexOutOfBound => Self::IndexOutOfBound,
            SysError::ItemMissing => Self::ItemMissing,
            SysError::LengthNotEnough(_) => Self::LengthNotEnough,
            SysError::Encoding => Self::Encoding,
            _ => Self::Unknown,
        }
    }
}