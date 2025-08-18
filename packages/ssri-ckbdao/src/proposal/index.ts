import { ccc } from "@ckb-ccc/core";
import { ssri } from "@ckb-ccc/ssri";
import {
  ProposalData,
  ProposalMetadata,
  VotingConfig,
  ExecutionAction,
  ProposalStatus,
  type ProposalDataLike,
  type ProposalMetadataLike,
  type VotingConfigLike,
  type ExecutionActionLike,
} from "../types";

/**
 * Represents the DAO Proposal contract for managing governance proposals.
 *
 * This class provides methods for creating, updating, and executing proposals
 * within the DAO governance system.
 *
 * @public
 * @category Proposal
 */
export class Proposal extends ssri.Trait {
  public readonly script: ccc.Script;

  /**
   * Constructs a new Proposal instance.
   *
   * @param code - The script code cell of the Proposal contract.
   * @param script - The type script of the Proposal contract.
   * @param config - Optional configuration with executor.
   */
  constructor(
    code: ccc.OutPointLike,
    script: ccc.ScriptLike,
    config?: {
      executor?: ssri.Executor | null;
    } | null
  ) {
    super(code, config?.executor);
    this.script = ccc.Script.from(script);
  }

  /**
   * Creates a new governance proposal on-chain.
   *
   * @param signer - The signer creating the proposal.
   * @param metadata - Proposal metadata including title and description.
   * @param votingConfig - Voting configuration for the proposal.
   * @param executionAction - Optional execution action if proposal passes.
   * @param deposit - Required deposit amount for proposal submission.
   * @param tx - Optional existing transaction to build upon.
   * @returns The transaction containing the proposal creation.
   * @tag Mutation - This method represents a mutation of the onchain state.
   */
  async create(
    signer: ccc.Signer,
    metadata: ProposalMetadataLike,
    votingConfig: VotingConfigLike,
    executionAction?: ExecutionActionLike | null,
    deposit?: ccc.FixedPointLike,
    tx?: ccc.TransactionLike | null
  ): Promise<ccc.Transaction> {
    const txReq = ccc.Transaction.from(tx ?? {});
    
    // Add input cells from signer to cover deposit
    if (deposit) {
      await txReq.completeInputsByCapacity(signer, deposit);
    } else {
      await txReq.completeInputsAtLeastOne(signer);
    }

    // Create proposal data
    const proposalData: ProposalDataLike = {
      proposal_id: ccc.hexFrom(new Uint8Array(32)), // Would be generated
      metadata,
      voting_parameters: votingConfig,
      execution_action: executionAction || { 
        action_type: 0,
        target_script: null,
        parameters: [],
        execution_deadline: 0n
      },
      status: ProposalStatus.Pending,
      total_yes_votes: 0n,
      total_no_votes: 0n,
      total_abstain_votes: 0n,
      vote_count: 0n,
      execution_tx_hash: null,
    };

    // Create proposal output cell
    const addressObj = await signer.getRecommendedAddressObj();
    const proposalOutput = ccc.CellOutput.from({
      capacity: deposit || ccc.fixedPointFrom(1000), // Minimum 1000 CKB
      lock: addressObj.script,
      type: this.script,
    });

    txReq.outputs.push(proposalOutput);
    txReq.outputsData.push(ccc.hexFrom(new Uint8Array())); // Would be encoded proposal data

    // Add witness for proposal creation
    const witnessArgs = ccc.WitnessArgs.from({
      lock: new Uint8Array(65), // Placeholder for signature
    });

    txReq.witnesses.push(ccc.hexFrom(witnessArgs.toBytes()));

    return txReq;
  }

  /**
   * Updates an existing proposal (only by the proposer before voting starts).
   *
   * @param signer - The signer (must be the original proposer).
   * @param proposalId - The ID of the proposal to update.
   * @param updates - Partial updates to apply to the proposal.
   * @param tx - Optional existing transaction to build upon.
   * @returns The transaction containing the proposal update.
   */
  async update(
    signer: ccc.Signer,
    proposalId: string,
    updates: Partial<ProposalMetadataLike>,
    tx?: ccc.TransactionLike | null
  ): Promise<ccc.Transaction> {
    const txReq = ccc.Transaction.from(tx ?? {});
    
    // Find the proposal cell
    const proposalCell = await this.findProposalCell(signer.client, proposalId);
    
    if (!proposalCell) {
      throw new Error(`Proposal ${proposalId} not found`);
    }

    // Verify proposer
    const proposerAddress = await signer.getRecommendedAddress();
    // Would check if proposer matches

    // Add proposal cell as input
    txReq.inputs.push(ccc.CellInput.from({
      previousOutput: proposalCell.outPoint,
      since: 0n,
    }));

    // Create updated proposal output
    const updatedOutput = ccc.CellOutput.from({
      capacity: proposalCell.cellOutput.capacity,
      lock: proposalCell.cellOutput.lock,
      type: proposalCell.cellOutput.type,
    });
    
    txReq.outputs.push(updatedOutput);
    txReq.outputsData.push(ccc.hexFrom(new Uint8Array())); // Updated proposal data

    // Add witness for proposal update
    const witnessArgs = ccc.WitnessArgs.from({
      lock: new Uint8Array(65), // Placeholder for signature
    });

    txReq.witnesses.push(ccc.hexFrom(witnessArgs.toBytes()));

    return txReq;
  }

  /**
   * Executes a passed proposal.
   *
   * @param signer - The signer executing the proposal (usually admin or automated).
   * @param proposalId - The ID of the proposal to execute.
   * @param tx - Optional existing transaction to build upon.
   * @returns The transaction containing the proposal execution.
   */
  async execute(
    signer: ccc.Signer,
    proposalId: string,
    tx?: ccc.TransactionLike | null
  ): Promise<ccc.Transaction> {
    const txReq = ccc.Transaction.from(tx ?? {});
    
    // Find the proposal cell
    const proposalCell = await this.findProposalCell(signer.client, proposalId);
    
    if (!proposalCell) {
      throw new Error(`Proposal ${proposalId} not found`);
    }

    // Add proposal cell as input
    txReq.inputs.push(ccc.CellInput.from({
      previousOutput: proposalCell.outPoint,
      since: 0n,
    }));

    // Create updated proposal output with executed status
    const executedOutput = ccc.CellOutput.from({
      capacity: proposalCell.cellOutput.capacity,
      lock: proposalCell.cellOutput.lock,
      type: proposalCell.cellOutput.type,
    });
    
    txReq.outputs.push(executedOutput);
    txReq.outputsData.push(ccc.hexFrom(new Uint8Array())); // Updated proposal data with executed status

    // Add witness for proposal execution
    const witnessArgs = ccc.WitnessArgs.from({
      lock: new Uint8Array(65), // Placeholder for signature
    });

    txReq.witnesses.push(ccc.hexFrom(witnessArgs.toBytes()));

    return txReq;
  }

  /**
   * Gets a proposal by ID.
   *
   * @param client - CKB client instance.
   * @param proposalId - The ID of the proposal to retrieve.
   * @returns The proposal data or null if not found.
   */
  async getProposal(
    client: ccc.Client,
    proposalId: string
  ): Promise<ProposalDataLike | null> {
    const proposalCell = await this.findProposalCell(client, proposalId);
    
    if (!proposalCell) {
      return null;
    }

    // Would decode proposal data from cell
    return {} as ProposalDataLike;
  }

  /**
   * Lists all proposals with optional filtering.
   *
   * @param client - CKB client instance.
   * @param filter - Optional filter criteria.
   * @returns Array of proposals matching the filter.
   */
  async listProposals(
    client: ccc.Client,
    filter?: {
      status?: ProposalStatus;
      category?: string;
      proposer?: string;
    }
  ): Promise<ProposalDataLike[]> {
    const collector = client.findCells({
      script: this.script,
      scriptType: "type",
      scriptSearchMode: "exact"
    });

    const proposals: ProposalDataLike[] = [];
    
    for await (const cell of collector) {
      // Would decode and filter proposals
      proposals.push({} as ProposalDataLike);
    }

    return proposals;
  }

  /**
   * Helper method to find a proposal cell by ID.
   */
  private async findProposalCell(
    client: ccc.Client,
    proposalId: string
  ): Promise<ccc.Cell | null> {
    const collector = client.findCells({
      script: this.script,
      scriptType: "type",
      scriptSearchMode: "exact"
    });

    for await (const cell of collector) {
      // Would check if this is the right proposal
      return cell;
    }

    return null;
  }

  /**
   * Helper method to generate proposal ID from proposal data.
   */
  private getProposalId(proposalData: ProposalDataLike): string {
    // Generate ID from proposal metadata hash
    return "proposal-id";
  }

  /**
   * Helper method to execute proposal action.
   */
  private async executeAction(
    action: ExecutionActionLike,
    tx: ccc.Transaction,
    signer: ccc.Signer
  ): Promise<void> {
    // Implementation would depend on the specific action type
  }
}