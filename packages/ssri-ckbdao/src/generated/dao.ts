// Auto-generated TypeScript types for CKB DAO molecule schema
// This file uses CCC and mol types directly where available

import { mol, ccc } from "@ckb-ccc/core";

// CKB DAO molecule codec implementations
export const Uint32Vec = mol.vector(mol.Uint32);
export const Uint64Opt = mol.option(mol.Uint64);
export const Uint128Opt = mol.option(mol.Uint128);
export const MultiSigConfig = mol.table({
  threshold: mol.Uint8,
  signers: mol.Byte32Vec,
  total_signers: mol.Uint8
});
export const TimeLockConfig = mol.table({
  lock_period: mol.Uint64,
  unlock_after: mol.Uint64,
  emergency_unlock_threshold: mol.Uint8
});
export const FundAllocation = mol.table({
  category: mol.String,
  allocated_amount: mol.Uint128,
  spent_amount: mol.Uint128,
  remaining_amount: mol.Uint128,
  period_end: mol.Uint64
});
export const FundAllocationVec = mol.vector(FundAllocation);
export const TreasuryData = mol.table({
  multi_sig_config: MultiSigConfig,
  time_lock_config: TimeLockConfig,
  fund_allocations: FundAllocationVec,
  total_balance: mol.Uint128,
  pending_withdrawals: mol.Uint128,
  last_updated: mol.Uint64,
  guardian_count: mol.Uint8,
  emergency_mode: mol.Uint8
});
export const ProposalMetadata = mol.table({
  title: mol.String,
  description: mol.String,
  proposer_lock_hash: mol.Byte32,
  category: mol.String,
  nostr_event_id: mol.option(mol.String),
  ipfs_hash: mol.option(mol.String),
  created_at: mol.Uint64
});
export const VotingParameters = mol.table({
  start_block: mol.Uint64,
  end_block: mol.Uint64,
  quorum_threshold: mol.Uint64,
  approval_threshold: mol.Uint8,
  vote_type: mol.Uint8
});
export const ExecutionAction = mol.table({
  action_type: mol.Uint8,
  target_script: mol.option(ccc.Script),
  parameters: mol.BytesVec,
  execution_deadline: mol.Uint64
});
export const ProposalData = mol.table({
  proposal_id: mol.Byte32,
  metadata: ProposalMetadata,
  voting_parameters: VotingParameters,
  execution_action: ExecutionAction,
  status: mol.Uint8,
  total_yes_votes: mol.Uint128,
  total_no_votes: mol.Uint128,
  total_abstain_votes: mol.Uint128,
  vote_count: mol.Uint32,
  execution_tx_hash: mol.Byte32Opt
});
export const RepresentativeProfile = mol.table({
  name: mol.String,
  bio: mol.String,
  contact_info: mol.String,
  website: mol.option(mol.String),
  nostr_pubkey: mol.option(mol.String),
  verified: mol.Uint8,
  joined_at: mol.Uint64
});
export const DelegationInfo = mol.table({
  total_delegated: mol.Uint128,
  delegator_count: mol.Uint32,
  delegation_cap: Uint128Opt,
  last_delegation_update: mol.Uint64
});
export const PerformanceMetrics = mol.table({
  proposals_voted: mol.Uint32,
  proposals_missed: mol.Uint32,
  participation_rate: mol.Uint8,
  alignment_score: mol.Uint8,
  last_active: mol.Uint64
});
export const RepresentativeData = mol.table({
  representative_id: mol.Byte32,
  lock_hash: mol.Byte32,
  profile: RepresentativeProfile,
  delegation_info: DelegationInfo,
  performance_metrics: PerformanceMetrics,
  status: mol.Uint8,
  staked_amount: mol.Uint128,
  reward_accumulated: mol.Uint128
});
export const VoteWeight = mol.table({
  base_amount: mol.Uint128,
  utxo_age_factor: mol.Uint32,
  nervos_dao_bonus: mol.Uint32,
  final_weight: mol.Uint128
});
export const VoteRecord = mol.table({
  proposal_id: mol.Byte32,
  voter_lock_hash: mol.Byte32,
  vote_choice: mol.Uint8,
  vote_weight: VoteWeight,
  timestamp: mol.Uint64,
  delegate_lock_hash: mol.Byte32Opt,
  rationale_nostr_event: mol.option(mol.String)
});
export const DelegationRecord = mol.table({
  delegator_lock_hash: mol.Byte32,
  representative_id: mol.Byte32,
  amount_delegated: mol.Uint128,
  delegation_type: mol.Uint8,
  topics: Uint32Vec,
  start_block: mol.Uint64,
  end_block: Uint64Opt,
  revocable: mol.Uint8
});
export const AddressBindingData = mol.table({
  user_lock_hash: mol.Byte32,
  passkey_data: mol.Bytes,
  binding_proof: mol.Bytes,
  verified_at: mol.Uint64,
  status: mol.Uint8,
  api_key_hash: mol.Byte32Opt
});
export const GovernanceMetrics = mol.table({
  total_proposals: mol.Uint32,
  active_proposals: mol.Uint32,
  total_voters: mol.Uint32,
  total_voting_power: mol.Uint128,
  total_representatives: mol.Uint32,
  total_delegated: mol.Uint128,
  participation_rate: mol.Uint8,
  last_updated: mol.Uint64
});
export const NotificationConfig = mol.table({
  email_hash: mol.Byte32Opt,
  nostr_pubkey: mol.option(mol.String),
  telegram_hash: mol.Byte32Opt,
  notification_types: mol.Uint32,
  frequency: mol.Uint8
});
export const EmergencyAction = mol.table({
  action_id: mol.Byte32,
  action_type: mol.Uint8,
  initiator: mol.Byte32,
  required_signatures: mol.Uint8,
  collected_signatures: mol.Byte32Vec,
  deadline: mol.Uint64,
  executed: mol.Uint8
});
export const DAOConfig = mol.table({
  version: mol.Uint32,
  name: mol.String,
  treasury_lock_hash: mol.Byte32,
  proposal_type_hash: mol.Byte32,
  voting_lock_hash: mol.Byte32,
  min_proposal_deposit: mol.Uint128,
  proposal_duration: mol.Uint64,
  execution_delay: mol.Uint64,
  guardian_set: mol.Byte32Vec
});
export const ConnectedTypeID = mol.table({
  type_id: mol.Byte32,
  connected_key: mol.Byte32
});

// Enums for DAO governance
export enum ProposalStatus {
  Pending = 0,
  Active = 1,
  Passed = 2,
  Rejected = 3,
  Executed = 4,
  Cancelled = 5,
}

export enum VoteChoice {
  Yes = 0,
  No = 1,
  Abstain = 2,
}

export enum RepresentativeStatus {
  Active = 0,
  Inactive = 1,
  Suspended = 2,
}


// Type aliases for common types
export type Uint32Like = ccc.NumLike;
export type Uint64Like = ccc.NumLike;
export type Uint128Like = ccc.NumLike;

// "Like" types for flexible input (similar to CCC pattern)
export interface MultiSigConfigLike {
  threshold: ccc.NumLike;
  signers: ccc.HexLike[];
  total_signers: ccc.NumLike;
}

export interface TimeLockConfigLike {
  lock_period: ccc.NumLike;
  unlock_after: ccc.NumLike;
  emergency_unlock_threshold: ccc.NumLike;
}

export interface FundAllocationLike {
  category: string;
  allocated_amount: ccc.NumLike;
  spent_amount: ccc.NumLike;
  remaining_amount: ccc.NumLike;
  period_end: ccc.NumLike;
}

export interface TreasuryDataLike {
  multi_sig_config: MultiSigConfigLike;
  time_lock_config: TimeLockConfigLike;
  fund_allocations: FundAllocationLike[];
  total_balance: ccc.NumLike;
  pending_withdrawals: ccc.NumLike;
  last_updated: ccc.NumLike;
  guardian_count: ccc.NumLike;
  emergency_mode: ccc.NumLike;
}

export interface ProposalMetadataLike {
  title: string;
  description: string;
  proposer_lock_hash: ccc.HexLike;
  category: string;
  nostr_event_id: string | null;
  ipfs_hash: string | null;
  created_at: ccc.NumLike;
}

export interface VotingParametersLike {
  start_block: ccc.NumLike;
  end_block: ccc.NumLike;
  quorum_threshold: ccc.NumLike;
  approval_threshold: ccc.NumLike;
  vote_type: ccc.NumLike;
}

export interface ExecutionActionLike {
  action_type: ccc.NumLike;
  target_script: ccc.ScriptLike | null;
  parameters: ccc.BytesLike[];
  execution_deadline: ccc.NumLike;
}

export interface ProposalDataLike {
  proposal_id: ccc.HexLike;
  metadata: ProposalMetadataLike;
  voting_parameters: VotingParametersLike;
  execution_action: ExecutionActionLike;
  status: ccc.NumLike;
  total_yes_votes: ccc.NumLike;
  total_no_votes: ccc.NumLike;
  total_abstain_votes: ccc.NumLike;
  vote_count: ccc.NumLike;
  execution_tx_hash: ccc.HexLike | null;
}

export interface RepresentativeProfileLike {
  name: string;
  bio: string;
  contact_info: string;
  website: string | null;
  nostr_pubkey: string | null;
  verified: ccc.NumLike;
  joined_at: ccc.NumLike;
}

export interface DelegationInfoLike {
  total_delegated: ccc.NumLike;
  delegator_count: ccc.NumLike;
  delegation_cap: Uint128Like | null;
  last_delegation_update: ccc.NumLike;
}

export interface PerformanceMetricsLike {
  proposals_voted: ccc.NumLike;
  proposals_missed: ccc.NumLike;
  participation_rate: ccc.NumLike;
  alignment_score: ccc.NumLike;
  last_active: ccc.NumLike;
}

export interface RepresentativeDataLike {
  representative_id: ccc.HexLike;
  lock_hash: ccc.HexLike;
  profile: RepresentativeProfileLike;
  delegation_info: DelegationInfoLike;
  performance_metrics: PerformanceMetricsLike;
  status: ccc.NumLike;
  staked_amount: ccc.NumLike;
  reward_accumulated: ccc.NumLike;
}

export interface VoteWeightLike {
  base_amount: ccc.NumLike;
  utxo_age_factor: ccc.NumLike;
  nervos_dao_bonus: ccc.NumLike;
  final_weight: ccc.NumLike;
}

export interface VoteRecordLike {
  proposal_id: ccc.HexLike;
  voter_lock_hash: ccc.HexLike;
  vote_choice: ccc.NumLike;
  vote_weight: VoteWeightLike;
  timestamp: ccc.NumLike;
  delegate_lock_hash: ccc.HexLike | null;
  rationale_nostr_event: string | null;
}

export interface DelegationRecordLike {
  delegator_lock_hash: ccc.HexLike;
  representative_id: ccc.HexLike;
  amount_delegated: ccc.NumLike;
  delegation_type: ccc.NumLike;
  topics: Uint32Like[];
  start_block: ccc.NumLike;
  end_block: Uint64Like | null;
  revocable: ccc.NumLike;
}

export interface AddressBindingDataLike {
  user_lock_hash: ccc.HexLike;
  passkey_data: ccc.BytesLike;
  binding_proof: ccc.BytesLike;
  verified_at: ccc.NumLike;
  status: ccc.NumLike;
  api_key_hash: ccc.HexLike | null;
}

export interface GovernanceMetricsLike {
  total_proposals: ccc.NumLike;
  active_proposals: ccc.NumLike;
  total_voters: ccc.NumLike;
  total_voting_power: ccc.NumLike;
  total_representatives: ccc.NumLike;
  total_delegated: ccc.NumLike;
  participation_rate: ccc.NumLike;
  last_updated: ccc.NumLike;
}

export interface NotificationConfigLike {
  email_hash: ccc.HexLike | null;
  nostr_pubkey: string | null;
  telegram_hash: ccc.HexLike | null;
  notification_types: ccc.NumLike;
  frequency: ccc.NumLike;
}

export interface EmergencyActionLike {
  action_id: ccc.HexLike;
  action_type: ccc.NumLike;
  initiator: ccc.HexLike;
  required_signatures: ccc.NumLike;
  collected_signatures: ccc.HexLike[];
  deadline: ccc.NumLike;
  executed: ccc.NumLike;
}

export interface DAOConfigLike {
  version: ccc.NumLike;
  name: string;
  treasury_lock_hash: ccc.HexLike;
  proposal_type_hash: ccc.HexLike;
  voting_lock_hash: ccc.HexLike;
  min_proposal_deposit: ccc.NumLike;
  proposal_duration: ccc.NumLike;
  execution_delay: ccc.NumLike;
  guardian_set: ccc.HexLike[];
}

export interface ConnectedTypeIDLike {
  type_id: ccc.HexLike;
  connected_key: ccc.HexLike;
}

