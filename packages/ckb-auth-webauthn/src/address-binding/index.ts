import { ccc } from "@ckb-ccc/core";
import { ssri } from "@ckb-ccc/ssri";
import {
  AddressBindingData,
  type AddressBindingDataLike,
} from "../generated";
import { BindingStatus, type BindingQuery, type CKBConfig } from "../types";

/**
 * Represents the DAO Address Binding contract for managing WebAuthn bindings.
 * 
 * This class provides methods for storing and retrieving WebAuthn credential
 * bindings on the CKB blockchain.
 * 
 * @public
 * @category AddressBinding
 */
export class AddressBinding extends ssri.Trait {
  public readonly typeScript: ccc.Script;
  private client?: ccc.Client;

  /**
   * Constructs a new AddressBinding instance.
   * 
   * @param code - The script code cell of the AddressBinding contract.
   * @param typeScript - The type script of the AddressBinding contract.
   * @param config - Optional configuration with executor and client.
   */
  constructor(
    code: ccc.OutPointLike,
    typeScript: ccc.ScriptLike,
    config?: {
      executor?: ssri.Executor | null;
      client?: ccc.Client;
    } | null
  ) {
    super(code, config?.executor);
    this.typeScript = ccc.Script.from(typeScript);
    this.client = config?.client;
  }

  /**
   * Store a WebAuthn binding on-chain.
   * 
   * @param signer - The signer to authorize the transaction.
   * @param bindingData - The address binding data to store.
   * @param tx - Optional existing transaction to build upon.
   * @returns The transaction containing the binding cell.
   */
  async storeBinding(
    signer: ccc.Signer,
    bindingData: AddressBindingDataLike,
    tx?: ccc.TransactionLike | null
  ): Promise<ccc.Transaction> {
    const txReq = ccc.Transaction.from(tx ?? {});

    // Ensure at least one input for the transaction
    if (txReq.inputs.length === 0) {
      await txReq.completeInputsAtLeastOne(signer);
    }

    // Encode binding data
    const bindingBytes = AddressBindingData.encode(bindingData);
    const bindingHex = ccc.hexFrom(bindingBytes);

    // Calculate capacity needed (minimum 61 CKB + data size)
    const dataSize = bindingBytes.length;
    const minCapacity = 61n + BigInt(Math.ceil(dataSize / 100));
    
    // Get user's address
    const addressObj = await signer.getRecommendedAddressObj();
    
    // Create binding cell with user's lock and DAO type script
    const bindingCell = {
      cellOutput: ccc.CellOutput.from({
        capacity: ccc.fixedPointFrom(minCapacity),
        lock: addressObj.script,
        type: this.typeScript,
      }),
      data: bindingHex,
    };

    // Add to transaction
    txReq.outputs.push(bindingCell.cellOutput);
    txReq.outputsData.push(bindingCell.data);

    // Add code cell dependency
    txReq.addCellDeps({
      outPoint: this.code,
      depType: "code",
    });

    // Complete inputs by capacity
    await txReq.completeInputsByCapacity(signer);

    return txReq;
  }

  /**
   * Query a binding by wallet address.
   * 
   * @param walletAddress - The CKB wallet address to query.
   * @returns The address binding data if found, null otherwise.
   */
  async getBinding(walletAddress: string): Promise<AddressBindingDataLike | null> {
    if (!this.client) {
      throw new Error("Client is required for querying bindings");
    }

    const address = await ccc.Address.fromString(walletAddress, this.client);
    const lockScript = address.script;

    // Search for cells with the binding type script and user's lock
    const collector = this.client.findCells({
      script: lockScript,
      scriptType: "lock" as const,
      scriptSearchMode: "exact",
      filter: {
        script: this.typeScript,
      }
    });

    for await (const cell of collector) {
      try {
        const bindingData = AddressBindingData.decode(cell.outputData);
        return {
          user_lock_hash: bindingData.user_lock_hash,
          webauthn_credential: bindingData.webauthn_credential,
          binding_proof: bindingData.binding_proof,
          verified_at: bindingData.verified_at,
          status: bindingData.status,
          api_key_hash: bindingData.api_key_hash ?? null,
        };
      } catch (e) {
        // Continue if decode fails
        continue;
      }
    }

    return null;
  }

  /**
   * Query bindings with optional filters.
   * 
   * @param query - Query parameters for filtering bindings.
   * @returns Array of address binding data matching the query.
   */
  async queryBindings(query?: BindingQuery): Promise<AddressBindingDataLike[]> {
    if (!this.client) {
      throw new Error("Client is required for querying bindings");
    }

    const bindings: AddressBindingDataLike[] = [];

    // Search for all cells with the binding type script
    const collector = this.client.findCells({
      script: this.typeScript,
      scriptType: "type" as const,
      scriptSearchMode: "exact",
    });

    for await (const cell of collector) {
      try {
        const bindingData = AddressBindingData.decode(cell.outputData);
        
        // Apply filters
        if (query?.status !== undefined && bindingData.status !== query.status) {
          continue;
        }

        if (query?.userLockHash && ccc.hexFrom(bindingData.user_lock_hash) !== query.userLockHash) {
          continue;
        }

        if (query?.credentialId) {
          const credId = ccc.hexFrom(bindingData.webauthn_credential.credential_id);
          if (credId !== query.credentialId) {
            continue;
          }
        }

        bindings.push({
          user_lock_hash: bindingData.user_lock_hash,
          webauthn_credential: bindingData.webauthn_credential,
          binding_proof: bindingData.binding_proof,
          verified_at: bindingData.verified_at,
          status: bindingData.status,
          api_key_hash: bindingData.api_key_hash ?? null,
        });

        // Apply limit
        if (query?.limit && bindings.length >= query.limit) {
          break;
        }
      } catch (e) {
        // Continue if decode fails
        continue;
      }
    }

    return bindings;
  }

  /**
   * Revoke a binding for a wallet address.
   * 
   * @param signer - The signer to authorize the transaction.
   * @param walletAddress - The wallet address whose binding to revoke.
   * @param tx - Optional existing transaction to build upon.
   * @returns The transaction that revokes the binding.
   */
  async revokeBinding(
    signer: ccc.Signer,
    walletAddress: string,
    tx?: ccc.TransactionLike | null
  ): Promise<ccc.Transaction> {
    if (!this.client) {
      throw new Error("Client is required for revoking bindings");
    }

    const txReq = ccc.Transaction.from(tx ?? {});

    // Find the binding cell
    const address = await ccc.Address.fromString(walletAddress, this.client);
    const lockScript = address.script;

    const collector = this.client.findCells({
      script: lockScript,
      scriptType: "lock" as const,
      scriptSearchMode: "exact",
      filter: {
        script: this.typeScript,
      }
    });

    let bindingCell: ccc.Cell | null = null;
    let bindingData: AddressBindingDataLike | null = null;

    for await (const cell of collector) {
      try {
        bindingData = AddressBindingData.decode(cell.outputData);
        if (bindingData.status !== BindingStatus.REVOKED) {
          bindingCell = cell;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!bindingCell || !bindingData) {
      throw new Error("Binding cell not found");
    }

    // Update binding status to revoked
    const updatedBinding: AddressBindingDataLike = {
      ...bindingData,
      status: BindingStatus.REVOKED,
    };

    // Add as input
    txReq.inputs.push(
      ccc.CellInput.from({
        previousOutput: bindingCell.outPoint,
        since: 0n,
      })
    );

    // Create updated output with revoked status
    const updatedBytes = AddressBindingData.encode(updatedBinding);
    const updatedHex = ccc.hexFrom(updatedBytes);

    const updatedCell = {
      cellOutput: bindingCell.cellOutput,
      data: updatedHex,
    };

    txReq.outputs.push(updatedCell.cellOutput);
    txReq.outputsData.push(updatedCell.data);

    // Add code cell dependency
    txReq.addCellDeps({
      outPoint: this.code,
      depType: "code",
    });

    // Complete inputs if needed
    await txReq.completeInputsByCapacity(signer);

    return txReq;
  }

  /**
   * Check if a binding exists and is valid.
   * 
   * @param walletAddress - The wallet address to check.
   * @returns True if a valid binding exists, false otherwise.
   */
  async hasValidBinding(walletAddress: string): Promise<boolean> {
    const binding = await this.getBinding(walletAddress);
    return binding !== null && binding.status === BindingStatus.VERIFIED;
  }

  /**
   * Get binding status for a wallet address.
   * 
   * @param walletAddress - The wallet address to check.
   * @returns The binding status.
   */
  async getBindingStatus(walletAddress: string): Promise<BindingStatus> {
    const binding = await this.getBinding(walletAddress);
    if (!binding) {
      return BindingStatus.NONE;
    }
    return binding.status;
  }

  /**
   * Create a client instance with the provided CKB configuration.
   * 
   * @param config - CKB configuration with RPC URL.
   * @returns A new AddressBinding instance with client.
   */
  static async create(config: CKBConfig): Promise<AddressBinding> {
    const client = new ccc.ClientPublicTestnet();
    
    return new AddressBinding(
      config.addressBindingCodeOutPoint!,
      config.addressBindingTypeScript!,
      {
        client,
      }
    );
  }
}