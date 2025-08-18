/**
 * DAO Type Definitions
 * 
 * These types are derived from the Molecule schema and will be used
 * throughout the dApp for type safety and consistency.
 */

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

export enum DelegationType {
  Full = 0,
  Partial = 1,
  TopicSpecific = 2,
}

// Treasury Types
export interface MultiSigConfig {
  threshold: number;
  signers: string[]; // Byte32 hashes
  totalSigners: number;
}

export interface TimeLockConfig {
  lockPeriod: bigint;
  unlockAfter: bigint;
  emergencyUnlockThreshold: number;
}

export interface FundAllocation {
  category: string;
  allocatedAmount: bigint;
  spentAmount: bigint;
  remainingAmount: bigint;
  periodEnd: bigint;
}

export interface TreasuryData {
  multiSigConfig: MultiSigConfig;
  timeLockConfig: TimeLockConfig;
  fundAllocations: FundAllocation[];
  totalBalance: bigint;
  pendingWithdrawals: bigint;
  lastUpdated: bigint;
  guardianCount: number;
  emergencyMode: boolean;
}

// Proposal Types
export interface ProposalMetadata {
  title: string;
  description: string;
  proposerLockHash: string;
  category: string;
  nostrEventId?: string;
  ipfsHash?: string;
  createdAt: bigint;
}

export interface VotingParameters {
  startBlock: bigint;
  endBlock: bigint;
  quorumThreshold: bigint;
  approvalThreshold: number;
  voteType: number;
}

export interface ExecutionAction {
  actionType: number;
  targetScript?: {
    codeHash: string;
    hashType: 'type' | 'data';
    args: string;
  };
  parameters: string[];
  executionDeadline: bigint;
}

export interface ProposalData {
  proposalId: string;
  metadata: ProposalMetadata;
  votingParameters: VotingParameters;
  executionAction?: ExecutionAction;
  status: ProposalStatus;
  totalYesVotes: bigint;
  totalNoVotes: bigint;
  totalAbstainVotes: bigint;
  voteCount: number;
  executionTxHash?: string;
}

// Representative Types
export interface RepresentativeProfile {
  name: string;
  bio: string;
  contactInfo: string;
  website?: string;
  nostrPubkey?: string;
  verified: boolean;
  joinedAt: bigint;
}

export interface DelegationInfo {
  totalDelegated: bigint;
  delegatorCount: number;
  delegationCap?: bigint;
  lastDelegationUpdate: bigint;
}

export interface PerformanceMetrics {
  proposalsVoted: number;
  proposalsMissed: number;
  participationRate: number;
  alignmentScore: number;
  lastActive: bigint;
}

export interface RepresentativeData {
  representativeId: string;
  lockHash: string;
  profile: RepresentativeProfile;
  delegationInfo: DelegationInfo;
  performanceMetrics: PerformanceMetrics;
  status: RepresentativeStatus;
  stakedAmount: bigint;
  rewardAccumulated: bigint;
}

// Voting Types
export interface VoteWeight {
  baseAmount: bigint;
  utxoAgeFactor: number;
  nervosDAOBonus: number;
  finalWeight: bigint;
}

export interface VoteRecord {
  proposalId: string;
  voterLockHash: string;
  voteChoice: VoteChoice;
  voteWeight: VoteWeight;
  timestamp: bigint;
  delegateLockHash?: string;
  rationaleNostrEvent?: string;
}

// Delegation Types
export interface DelegationRecord {
  delegatorLockHash: string;
  representativeId: string;
  amountDelegated: bigint;
  delegationType: DelegationType;
  topics?: number[];
  startBlock: bigint;
  endBlock?: bigint;
  revocable: boolean;
}

// WebAuthn Types
export interface WebAuthnCredential {
  credentialId: string;
  publicKey: string;
  algorithm: number;
  attestationFormat: string;
  createdAt: bigint;
}

export interface AddressBindingData {
  userLockHash: string;
  webauthnCredential: WebAuthnCredential;
  bindingProof: string;
  verifiedAt: bigint;
  status: number;
  apiKeyHash?: string;
}

// Governance Metrics
export interface GovernanceMetrics {
  totalProposals: number;
  activeProposals: number;
  totalVoters: number;
  totalVotingPower: bigint;
  totalRepresentatives: number;
  totalDelegated: bigint;
  participationRate: number;
  lastUpdated: bigint;
}

// DAO Configuration
export interface DAOConfig {
  version: number;
  name: string;
  treasuryLockHash: string;
  proposalTypeHash: string;
  votingLockHash: string;
  minProposalDeposit: bigint;
  proposalDuration: bigint;
  executionDelay: bigint;
  guardianSet: string[];
}

// Notification Configuration
export interface NotificationConfig {
  emailHash?: string;
  nostrPubkey?: string;
  telegramHash?: string;
  notificationTypes: number;
  frequency: number;
}

// Emergency Action
export interface EmergencyAction {
  actionId: string;
  actionType: number;
  initiator: string;
  requiredSignatures: number;
  collectedSignatures: string[];
  deadline: bigint;
  executed: boolean;
}

// Helper type for creating new entities
export type CreateProposalInput = Omit<ProposalData, 'proposalId' | 'status' | 'totalYesVotes' | 'totalNoVotes' | 'totalAbstainVotes' | 'voteCount' | 'executionTxHash'>;
export type CreateRepresentativeInput = Omit<RepresentativeData, 'representativeId' | 'status' | 'rewardAccumulated'>;

// Type guards
export function isProposalActive(proposal: ProposalData): boolean {
  return proposal.status === ProposalStatus.Active;
}

export function isRepresentativeActive(representative: RepresentativeData): boolean {
  return representative.status === RepresentativeStatus.Active;
}

export function canVote(proposal: ProposalData, currentBlock: bigint): boolean {
  return proposal.status === ProposalStatus.Active &&
    currentBlock >= proposal.votingParameters.startBlock &&
    currentBlock <= proposal.votingParameters.endBlock;
}