import { ccc } from "@ckb-ccc/core";
import { ssri } from "@ckb-ccc/ssri";
import * as dao from "../generated/dao.js";

export interface BindingParams {
  webauthnCredential: dao.WebAuthnCredentialLike;
  bindingProof: ccc.BytesLike;
  apiKeyHash?: ccc.HexLike | null;
}

export interface VerifyParams {
  signature: ccc.BytesLike;
  challenge: ccc.BytesLike;
}

/**
 * AddressBinding trait for managing address binding cells
 * Enables WebAuthn-based secure binding between CKB addresses and DAO accounts
 * 
 * @public
 * @category AddressBinding
 */
export class AddressBinding extends ssri.Trait {
  public readonly script: ccc.Script;

  /**
   * Constructs a new AddressBinding instance.
   *
   * @param code - The script code cell of the AddressBinding contract.
   * @param script - The type script of the AddressBinding contract.
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
   * Create a new address binding cell
   * This binds a CKB address to a WebAuthn credential for secure DAO operations
   * 
   * @param signer - The signer for the transaction
   * @param params - The binding parameters
   * @param tx - Optional existing transaction to build upon
   * @returns The updated transaction response
   */
  async bind(
    signer: ccc.Signer,
    params: BindingParams,
    tx?: ccc.Transaction
  ): Promise<ssri.ExecutorResponse<ccc.Transaction>> {
    if (!this.executor) {
      throw new Error("Executor required for SSRI operations");
    }

    const txReq = ccc.Transaction.from(tx ?? {});
    
    // Ensure at least one input for the transaction
    if (txReq.inputs.length === 0) {
      await txReq.completeInputsAtLeastOne(signer);
      await txReq.completeInputsByCapacity(signer);
    }

    const addressObj = await signer.getRecommendedAddressObj();
    
    // Create the binding data
    const bindingData: dao.AddressBindingDataLike = {
      user_lock_hash: addressObj.script.hash(),
      webauthn_credential: params.webauthnCredential,
      binding_proof: params.bindingProof,
      verified_at: BigInt(Date.now()),
      status: 0, // 0 = pending
      api_key_hash: params.apiKeyHash ?? null,
    };

    // Encode the binding data using Molecule
    const bindingDataBytes = dao.AddressBindingData.encode(bindingData);
    const bindingDataHex = ccc.hexFrom(bindingDataBytes);
    const txHex = ccc.hexFrom(txReq.toBytes());

    // Execute SSRI method
    const methodPath = "AddressBinding.bind";
    const res = await this.executor.runScript(
      this.code,
      methodPath,
      [txHex, bindingDataHex],
      { script: this.script }
    );

    // Parse the returned transaction
    if (res) {
      const resTx = res.map((res) => ccc.Transaction.fromBytes(res));
      // Add the binding code cell as a dependency
      resTx.res.addCellDeps({
        outPoint: this.code,
        depType: "code",
      });
      
      return resTx;
    } else {
      throw new Error("No result from SSRI executor");
    }
  }

  /**
   * Verify an address binding
   * Updates the binding status from pending to verified
   * 
   * @param signer - The signer for the transaction
   * @param bindingCellOutPoint - The outpoint of the binding cell to verify
   * @param verifyParams - The verification parameters
   * @param tx - Optional existing transaction to build upon
   * @returns The updated transaction response
   */
  async verify(
    signer: ccc.Signer,
    bindingCellOutPoint: ccc.OutPointLike,
    verifyParams: VerifyParams,
    tx?: ccc.Transaction
  ): Promise<ssri.ExecutorResponse<ccc.Transaction>> {
    if (!this.executor) {
      throw new Error("Executor required for SSRI operations");
    }

    const txReq = ccc.Transaction.from(tx ?? {});
    const outPoint = ccc.OutPoint.from(bindingCellOutPoint);

    // Fetch the binding cell
    const bindingCell = await signer.client.getCell(outPoint);
    if (!bindingCell || !bindingCell.cellOutput.type) {
      throw new Error("Binding cell not found");
    }

    // Decode the current binding data from outputData
    const currentData = dao.AddressBindingData.decode(bindingCell.outputData);
    
    // Update status to verified
    const updatedData: dao.AddressBindingDataLike = {
      user_lock_hash: currentData.user_lock_hash,
      webauthn_credential: currentData.webauthn_credential,
      binding_proof: currentData.binding_proof,
      verified_at: BigInt(Date.now()),
      status: 1, // 1 = verified
      api_key_hash: currentData.api_key_hash ?? null,
    };

    const updatedDataBytes = dao.AddressBindingData.encode(updatedData);
    const updatedDataHex = ccc.hexFrom(updatedDataBytes);
    const verifyParamsHex = ccc.hexFrom(verifyParams.signature);
    const txHex = ccc.hexFrom(txReq.toBytes());

    // Execute SSRI method
    const methodPath = "AddressBinding.verify";
    const res = await this.executor.runScript(
      this.code,
      methodPath,
      [txHex, updatedDataHex, verifyParamsHex],
      { script: this.script }
    );

    // Parse the returned transaction
    if (res) {
      const resTx = res.map((res) => ccc.Transaction.fromBytes(res));
      // Add the binding code cell as a dependency
      resTx.res.addCellDeps({
        outPoint: this.code,
        depType: "code",
      });
      
      return resTx;
    } else {
      throw new Error("No result from SSRI executor");
    }
  }

  /**
   * Revoke an address binding
   * Sets the binding status to revoked
   * 
   * @param signer - The signer for the transaction
   * @param bindingCellOutPoint - The outpoint of the binding cell to revoke
   * @param tx - Optional existing transaction to build upon
   * @returns The updated transaction response
   */
  async revoke(
    signer: ccc.Signer,
    bindingCellOutPoint: ccc.OutPointLike,
    tx?: ccc.Transaction
  ): Promise<ssri.ExecutorResponse<ccc.Transaction>> {
    if (!this.executor) {
      throw new Error("Executor required for SSRI operations");
    }

    const txReq = ccc.Transaction.from(tx ?? {});
    const outPoint = ccc.OutPoint.from(bindingCellOutPoint);

    // Fetch the binding cell
    const bindingCell = await signer.client.getCell(outPoint);
    if (!bindingCell || !bindingCell.cellOutput.type) {
      throw new Error("Binding cell not found");
    }

    // Decode the current binding data from outputData
    const currentData = dao.AddressBindingData.decode(bindingCell.outputData);
    
    // Update status to revoked
    const updatedData: dao.AddressBindingDataLike = {
      user_lock_hash: currentData.user_lock_hash,
      webauthn_credential: currentData.webauthn_credential,
      binding_proof: currentData.binding_proof,
      verified_at: currentData.verified_at,
      status: 2, // 2 = revoked
      api_key_hash: currentData.api_key_hash ?? null,
    };

    const updatedDataBytes = dao.AddressBindingData.encode(updatedData);
    const updatedDataHex = ccc.hexFrom(updatedDataBytes);
    const txHex = ccc.hexFrom(txReq.toBytes());

    // Execute SSRI method
    const methodPath = "AddressBinding.revoke";
    const res = await this.executor.runScript(
      this.code,
      methodPath,
      [txHex, updatedDataHex],
      { script: this.script }
    );

    // Parse the returned transaction
    if (res) {
      const resTx = res.map((res) => ccc.Transaction.fromBytes(res));
      // Add the binding code cell as a dependency
      resTx.res.addCellDeps({
        outPoint: this.code,
        depType: "code",
      });
      
      return resTx;
    } else {
      throw new Error("No result from SSRI executor");
    }
  }

  /**
   * Query binding status for an address
   * 
   * @param client - The CKB client
   * @param address - The address to check
   * @returns The binding status and data
   */
  async getBindingStatus(
    client: ccc.Client,
    address: ccc.AddressLike
  ): Promise<{
    status: "none" | "pending" | "verified" | "revoked";
    bindingData?: dao.AddressBindingDataLike;
    cellOutPoint?: ccc.OutPoint;
  }> {
    const addressObj = ccc.Address.from(address);
    const lockScript = addressObj.script;

    // Search for binding cells with this type script
    const collector = client.findCells({
      script: this.script,
      scriptType: "type",
      scriptSearchMode: "exact",
    });

    for await (const cell of collector) {
      try {
        // Check if the lock script matches the user's address
        if (cell.cellOutput.lock.hash() === lockScript.hash()) {
          const bindingData = dao.AddressBindingData.decode(cell.outputData);
          
          let status: "none" | "pending" | "verified" | "revoked" = "none";
          switch (Number(bindingData.status)) {
            case 0:
              status = "pending";
              break;
            case 1:
              status = "verified";
              break;
            case 2:
              status = "revoked";
              break;
          }

          return {
            status,
            bindingData: {
              user_lock_hash: bindingData.user_lock_hash,
              webauthn_credential: bindingData.webauthn_credential,
              binding_proof: bindingData.binding_proof,
              verified_at: bindingData.verified_at,
              status: bindingData.status,
              api_key_hash: bindingData.api_key_hash ?? null,
            },
            cellOutPoint: cell.outPoint,
          };
        }
      } catch (e) {
        // Continue if decode fails
        continue;
      }
    }

    return { status: "none" };
  }

  /**
   * Build a transaction skeleton for address binding
   * This provides the structure for wallet integration
   */
  buildBindingSkeleton(params: {
    userLockHash: ccc.HexLike;
    webauthnCredential: dao.WebAuthnCredentialLike;
    capacity?: ccc.FixedPointLike;
  }): {
    inputs: string;
    outputs: string;
    cellDeps: string;
    headerDeps: string;
    witnesses: string;
  } {
    return {
      inputs: `
Input Cell:
  lock: User's Lock Script
    args: User's address args
    rules: Must be controlled by the user
  type: null
  data: empty
  capacity: >= ${params.capacity || 200} CKB`,
      
      outputs: `
Output Cell (Address Binding):
  lock: User's Lock Script
    args: User's address args
    rules: Same as input lock
  type: AddressBinding Type Script
    args: Binding ID (generated)
    rules: Validates WebAuthn credential and binding proof
  data: AddressBindingData (Molecule encoded)
    - user_lock_hash: ${params.userLockHash}
    - webauthn_credential: WebAuthn credential data
    - binding_proof: Cryptographic proof
    - verified_at: Current timestamp
    - status: 0 (pending)
    - api_key_hash: Optional API key`,
      
      cellDeps: `
AddressBinding Type Script Cell:
  - Contains the AddressBinding validation logic
  - Verifies WebAuthn signatures
  - Manages binding lifecycle`,
      
      headerDeps: `
None required for basic binding`,
      
      witnesses: `
0: WitnessArgs with signature from user's lock script
1: WebAuthn attestation data (optional)`,
    };
  }
}