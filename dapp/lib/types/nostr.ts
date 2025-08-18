/**
 * Nostr Event Types for CKB DAO Portal v2
 * 
 * These types define the structure of off-chain data stored in Nostr
 * for discussions, rationales, and other non-critical governance data.
 */

// Standard Nostr event interface
export interface NostrEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

// DAO-specific event kinds (30000-30099 range for parameterized replaceable events)
export enum DAOEventKind {
  PROPOSAL_DISCUSSION = 30040,      // Main proposal discussion thread
  PROPOSAL_COMMENT = 30041,          // Comments on proposals
  REPRESENTATIVE_UPDATE = 30042,     // Representative statements/updates
  VOTE_RATIONALE = 30043,           // Explanations for voting decisions
  CAMPAIGN_MESSAGE = 30044,         // Representative campaign content
  GOVERNANCE_ANNOUNCEMENT = 30045,  // Official DAO announcements
  DELEGATION_STATEMENT = 30046,     // Delegation explanations
  TREASURY_REPORT = 30047,         // Treasury status reports
}

// Base interface for all DAO-related Nostr events
export interface DAONostrEvent extends NostrEvent {
  kind: DAOEventKind;
  dao_metadata?: {
    chain_reference?: string;      // On-chain transaction or cell reference
    proposal_id?: string;          // Related proposal ID
    representative_id?: string;    // Related representative ID
    block_number?: number;         // CKB block number for context
  };
}

// Content types for each event kind (parsed from JSON string)
export interface ProposalDiscussionContent {
  proposal_id: string;           // On-chain proposal ID
  title: string;
  detailed_description: string;  // Full proposal text
  supporting_documents?: {
    ipfs_hash?: string;
    url?: string;
    description?: string;
  }[];
  author_address: string;        // CKB address of proposer
  category: 'grant' | 'governance' | 'treasury' | 'parameter' | 'other';
  discussion_rules?: string;     // Community guidelines for discussion
}

// Proposal discussion thread
export interface ProposalDiscussion extends DAONostrEvent {
  kind: DAOEventKind.PROPOSAL_DISCUSSION;
  content: string;  // JSON-encoded ProposalDiscussionContent
  tags: [
    ['d', string],                // Unique identifier (proposal_id)
    ['proposal', string],         // Proposal ID tag
    ['category', string],         // Category tag
    ['status', string],          // Current status
    ...string[][]
  ];
}

export interface ProposalCommentContent {
  proposal_id: string;
  comment_text: string;
  sentiment?: 'support' | 'oppose' | 'neutral' | 'question';
  parent_comment_id?: string;   // For nested comments
  author_address?: string;       // Optional CKB address
}

// Comment on a proposal
export interface ProposalComment extends DAONostrEvent {
  kind: DAOEventKind.PROPOSAL_COMMENT;
  content: string;  // JSON-encoded ProposalCommentContent
  tags: [
    ['e', string],               // Root proposal event ID
    ['p', string],               // Parent comment event ID (if reply)
    ['proposal', string],        // Proposal ID
    ...string[][]
  ];
}

export interface RepresentativeUpdateContent {
  representative_id: string;
  update_type: 'statement' | 'position' | 'report' | 'announcement';
  title: string;
  message: string;
  related_proposals?: string[];  // Proposal IDs this update relates to
  voting_intentions?: {
    proposal_id: string;
    intended_vote: 'yes' | 'no' | 'abstain';
    reasoning: string;
  }[];
}

// Representative updates and statements
export interface RepresentativeUpdate extends DAONostrEvent {
  kind: DAOEventKind.REPRESENTATIVE_UPDATE;
  content: string;  // JSON-encoded RepresentativeUpdateContent
  tags: [
    ['d', string],              // Representative ID
    ['representative', string], // Representative ID tag
    ['type', string],           // Update type
    ...string[][]
  ];
}

export interface VoteRationaleContent {
  proposal_id: string;
  voter_address: string;        // CKB address of voter
  vote: 'yes' | 'no' | 'abstain';
  rationale: string;            // Explanation for the vote
  factors_considered?: string[]; // Key factors in decision
  delegate_address?: string;    // If voting through representative
}

// Vote rationale explanation
export interface VoteRationale extends DAONostrEvent {
  kind: DAOEventKind.VOTE_RATIONALE;
  content: string;  // JSON-encoded VoteRationaleContent
  tags: [
    ['d', string],              // Unique ID (proposal_id + voter_address)
    ['proposal', string],       // Proposal ID
    ['vote', string],          // Vote choice
    ...string[][]
  ];
}

export interface CampaignMessageContent {
  representative_id: string;
  campaign_type: 'initial' | 'reelection' | 'position' | 'achievement';
  title: string;
  message: string;
  platform_points?: string[];   // Key platform positions
  achievements?: {
    description: string;
    proposal_ids?: string[];    // Related proposals
    impact?: string;
  }[];
  commitments?: string[];       // Future commitments
}

// Representative campaign message
export interface CampaignMessage extends DAONostrEvent {
  kind: DAOEventKind.CAMPAIGN_MESSAGE;
  content: string;  // JSON-encoded CampaignMessageContent
  tags: [
    ['d', string],              // Representative ID + timestamp
    ['representative', string], // Representative ID
    ['campaign', string],       // Campaign type
    ...string[][]
  ];
}

export interface GovernanceAnnouncementContent {
  announcement_type: 'emergency' | 'update' | 'result' | 'schedule' | 'rule_change';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  affected_proposals?: string[];
  affected_representatives?: string[];
  action_required?: {
    description: string;
    deadline?: number;         // Unix timestamp
  };
  signed_by: string[];         // Guardian/admin signatures
}

// Official governance announcement
export interface GovernanceAnnouncement extends DAONostrEvent {
  kind: DAOEventKind.GOVERNANCE_ANNOUNCEMENT;
  content: string;  // JSON-encoded GovernanceAnnouncementContent
  tags: [
    ['d', string],              // Unique announcement ID
    ['type', string],           // Announcement type
    ['severity', string],       // Severity level
    ...string[][]
  ];
}

export interface DelegationStatementContent {
  delegator_address: string;
  representative_id: string;
  delegation_type: 'full' | 'partial' | 'topic-specific';
  topics?: string[];           // For topic-specific delegation
  reasoning: string;           // Why delegating to this representative
  expectations?: string[];      // What delegator expects
  conditions?: string[];        // Conditions for maintaining delegation
}

// Delegation statement
export interface DelegationStatement extends DAONostrEvent {
  kind: DAOEventKind.DELEGATION_STATEMENT;
  content: string;  // JSON-encoded DelegationStatementContent
  tags: [
    ['d', string],              // Delegator address + representative ID
    ['representative', string], // Representative ID
    ['delegation', string],     // Delegation type
    ...string[][]
  ];
}

export interface TreasuryReportContent {
  report_period: {
    start_block: number;
    end_block: number;
  };
  treasury_balance: string;     // In CKB
  allocations: {
    category: string;
    allocated: string;
    spent: string;
    remaining: string;
  }[];
  executed_proposals: {
    proposal_id: string;
    amount: string;
    recipient: string;
    purpose: string;
  }[];
  pending_withdrawals: string;
  guardian_signatures: string[]; // Signatures from treasury guardians
}

// Treasury report
export interface TreasuryReport extends DAONostrEvent {
  kind: DAOEventKind.TREASURY_REPORT;
  content: string;  // JSON-encoded TreasuryReportContent
  tags: [
    ['d', string],              // Report period identifier
    ['treasury', 'report'],
    ['period', string],         // Period description
    ...string[][]
  ];
}

// Utility functions for Nostr event handling

export class NostrDAOEventBuilder {
  /**
   * Create a proposal discussion event
   */
  static createProposalDiscussion(
    proposalId: string,
    title: string,
    description: string,
    category: string,
    authorAddress: string,
    additionalTags: string[][] = []
  ): Partial<ProposalDiscussion> {
    const content: ProposalDiscussionContent = {
      proposal_id: proposalId,
      title,
      detailed_description: description,
      author_address: authorAddress,
      category: category as any,
    };

    return {
      kind: DAOEventKind.PROPOSAL_DISCUSSION,
      content: JSON.stringify(content),
      tags: [
        ['d', proposalId],
        ['proposal', proposalId],
        ['category', category],
        ['status', 'draft'],
        ...additionalTags,
      ],
    };
  }

  /**
   * Create a vote rationale event
   */
  static createVoteRationale(
    proposalId: string,
    voterAddress: string,
    vote: 'yes' | 'no' | 'abstain',
    rationale: string
  ): Partial<VoteRationale> {
    const content: VoteRationaleContent = {
      proposal_id: proposalId,
      voter_address: voterAddress,
      vote,
      rationale,
    };

    return {
      kind: DAOEventKind.VOTE_RATIONALE,
      content: JSON.stringify(content),
      tags: [
        ['d', `${proposalId}-${voterAddress}`],
        ['proposal', proposalId],
        ['vote', vote],
      ],
    };
  }

  /**
   * Parse a Nostr event into a typed DAO event
   */
  static parseDAOEvent(event: NostrEvent): DAONostrEvent | null {
    if (event.kind < 30040 || event.kind > 30047) {
      return null;
    }

    try {
      return {
        ...event,
        kind: event.kind as DAOEventKind,
        content: event.content, // Keep as string
        dao_metadata: this.extractDAOMetadata(event.tags),
      } as DAONostrEvent;
    } catch (error) {
      console.error('Failed to parse DAO event:', error);
      return null;
    }
  }

  /**
   * Parse the content of a specific event type
   */
  static parseEventContent<T>(event: DAONostrEvent): T | null {
    try {
      return JSON.parse(event.content) as T;
    } catch (error) {
      console.error('Failed to parse event content:', error);
      return null;
    }
  }

  /**
   * Helper to parse specific event types
   */
  static parseProposalDiscussion(event: ProposalDiscussion): ProposalDiscussionContent | null {
    return this.parseEventContent<ProposalDiscussionContent>(event);
  }

  static parseProposalComment(event: ProposalComment): ProposalCommentContent | null {
    return this.parseEventContent<ProposalCommentContent>(event);
  }

  static parseRepresentativeUpdate(event: RepresentativeUpdate): RepresentativeUpdateContent | null {
    return this.parseEventContent<RepresentativeUpdateContent>(event);
  }

  static parseVoteRationale(event: VoteRationale): VoteRationaleContent | null {
    return this.parseEventContent<VoteRationaleContent>(event);
  }

  static parseCampaignMessage(event: CampaignMessage): CampaignMessageContent | null {
    return this.parseEventContent<CampaignMessageContent>(event);
  }

  static parseGovernanceAnnouncement(event: GovernanceAnnouncement): GovernanceAnnouncementContent | null {
    return this.parseEventContent<GovernanceAnnouncementContent>(event);
  }

  static parseDelegationStatement(event: DelegationStatement): DelegationStatementContent | null {
    return this.parseEventContent<DelegationStatementContent>(event);
  }

  static parseTreasuryReport(event: TreasuryReport): TreasuryReportContent | null {
    return this.parseEventContent<TreasuryReportContent>(event);
  }

  /**
   * Extract DAO metadata from event tags
   */
  private static extractDAOMetadata(tags: string[][]): DAONostrEvent['dao_metadata'] {
    const metadata: DAONostrEvent['dao_metadata'] = {};

    for (const tag of tags) {
      switch (tag[0]) {
        case 'proposal':
          metadata.proposal_id = tag[1];
          break;
        case 'representative':
          metadata.representative_id = tag[1];
          break;
        case 'block':
          metadata.block_number = parseInt(tag[1], 10);
          break;
        case 'chain_ref':
          metadata.chain_reference = tag[1];
          break;
      }
    }

    return metadata;
  }
}

// Storage interface for Nostr events
export interface NostrEventStorage {
  saveEvent(event: DAONostrEvent): Promise<void>;
  getEvent(id: string): Promise<DAONostrEvent | null>;
  getEventsByProposal(proposalId: string): Promise<DAONostrEvent[]>;
  getEventsByRepresentative(representativeId: string): Promise<DAONostrEvent[]>;
  getEventsByKind(kind: DAOEventKind): Promise<DAONostrEvent[]>;
  queryEvents(filter: Partial<DAONostrEvent>): Promise<DAONostrEvent[]>;
}