// Export all generated types from the molecule schema
export * from './generated/dao';

// Re-export specific types that might have different names
export { 
  VotingParameters as VotingConfig,
  VotingParametersLike as VotingConfigLike,
  VoteRecord as VotingRecord,
  VoteRecordLike as VotingRecordLike,
  VoteWeight as WeightFactors,
  VoteWeightLike as WeightFactorsLike
} from './generated/dao';

// Define DAOProtocolDataLike interface
export interface DAOProtocolDataLike {
  version: number;
  config: import('./generated/dao').DAOConfigLike;
  treasuryConfig?: any;
  lastUpdated: bigint;
}