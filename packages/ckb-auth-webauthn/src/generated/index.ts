// Auto-generated from dao.mol schema
// Do not edit manually

import { ccc } from "@ckb-ccc/core";

// WebAuthn Credential type
export interface WebAuthnCredentialLike {
  credential_id: ccc.BytesLike;
  public_key: ccc.BytesLike;
  algorithm: number;
  attestation_format: string;
  created_at: bigint;
}

export class WebAuthnCredential {
  credential_id: Uint8Array;
  public_key: Uint8Array;
  algorithm: number;
  attestation_format: string;
  created_at: bigint;

  constructor(data: WebAuthnCredentialLike) {
    this.credential_id = ccc.bytesFrom(data.credential_id);
    this.public_key = ccc.bytesFrom(data.public_key);
    this.algorithm = data.algorithm;
    this.attestation_format = data.attestation_format;
    this.created_at = data.created_at;
  }

  static from(data: WebAuthnCredentialLike): WebAuthnCredential {
    return new WebAuthnCredential(data);
  }

  static encode(data: WebAuthnCredentialLike): Uint8Array {
    // Simplified encoding - in production, use proper Molecule encoding
    const credential = WebAuthnCredential.from(data);
    const encoder = new TextEncoder();
    
    // Create a simple concatenated byte array
    const parts: Uint8Array[] = [
      credential.credential_id,
      credential.public_key,
      new Uint8Array(new Uint32Array([credential.algorithm]).buffer),
      encoder.encode(credential.attestation_format),
      new Uint8Array(new BigUint64Array([credential.created_at]).buffer),
    ];
    
    // Calculate total length
    let totalLength = 0;
    for (const part of parts) {
      totalLength += 4 + part.length; // 4 bytes for length prefix
    }
    
    // Combine all parts with length prefixes
    const result = new Uint8Array(totalLength);
    let offset = 0;
    
    for (const part of parts) {
      const lengthBytes = new Uint8Array(new Uint32Array([part.length]).buffer);
      result.set(lengthBytes, offset);
      offset += 4;
      result.set(part, offset);
      offset += part.length;
    }
    
    return result;
  }

  static decode(bytes: ccc.BytesLike): WebAuthnCredential {
    const data = ccc.bytesFrom(bytes);
    let offset = 0;
    
    // Read credential_id
    const credIdLength = new Uint32Array(data.slice(offset, offset + 4).buffer)[0];
    offset += 4;
    const credential_id = data.slice(offset, offset + credIdLength);
    offset += credIdLength;
    
    // Read public_key
    const pubKeyLength = new Uint32Array(data.slice(offset, offset + 4).buffer)[0];
    offset += 4;
    const public_key = data.slice(offset, offset + pubKeyLength);
    offset += pubKeyLength;
    
    // Read algorithm
    offset += 4; // Skip length prefix
    const algorithm = new Uint32Array(data.slice(offset, offset + 4).buffer)[0];
    offset += 4;
    
    // Read attestation_format
    const formatLength = new Uint32Array(data.slice(offset, offset + 4).buffer)[0];
    offset += 4;
    const attestation_format = new TextDecoder().decode(data.slice(offset, offset + formatLength));
    offset += formatLength;
    
    // Read created_at
    offset += 4; // Skip length prefix
    const created_at = new BigUint64Array(data.slice(offset, offset + 8).buffer)[0];
    
    return new WebAuthnCredential({
      credential_id,
      public_key,
      algorithm,
      attestation_format,
      created_at,
    });
  }
}

// Address Binding Data type
export interface AddressBindingDataLike {
  user_lock_hash: ccc.HexLike;
  webauthn_credential: WebAuthnCredentialLike;
  binding_proof: ccc.BytesLike;
  verified_at: bigint;
  status: number;
  api_key_hash?: ccc.HexLike | null;
}

export class AddressBindingData {
  user_lock_hash: Uint8Array;
  webauthn_credential: WebAuthnCredential;
  binding_proof: Uint8Array;
  verified_at: bigint;
  status: number;
  api_key_hash: Uint8Array | null;

  constructor(data: AddressBindingDataLike) {
    this.user_lock_hash = ccc.bytesFrom(data.user_lock_hash);
    this.webauthn_credential = WebAuthnCredential.from(data.webauthn_credential);
    this.binding_proof = ccc.bytesFrom(data.binding_proof);
    this.verified_at = data.verified_at;
    this.status = data.status;
    this.api_key_hash = data.api_key_hash ? ccc.bytesFrom(data.api_key_hash) : null;
  }

  static from(data: AddressBindingDataLike): AddressBindingData {
    return new AddressBindingData(data);
  }

  static encode(data: AddressBindingDataLike): Uint8Array {
    const binding = AddressBindingData.from(data);
    
    // Encode WebAuthn credential
    const credentialBytes = WebAuthnCredential.encode(binding.webauthn_credential);
    
    // Calculate total size
    let totalSize = 32 + // user_lock_hash
                   4 + credentialBytes.length + // credential with length prefix
                   4 + binding.binding_proof.length + // proof with length prefix
                   8 + // verified_at
                   1 + // status
                   1 + // api_key_hash presence flag
                   (binding.api_key_hash ? 32 : 0); // optional api_key_hash
    
    const result = new Uint8Array(totalSize);
    let offset = 0;
    
    // Write user_lock_hash
    result.set(binding.user_lock_hash, offset);
    offset += 32;
    
    // Write credential with length prefix
    const credLengthBytes = new Uint8Array(new Uint32Array([credentialBytes.length]).buffer);
    result.set(credLengthBytes, offset);
    offset += 4;
    result.set(credentialBytes, offset);
    offset += credentialBytes.length;
    
    // Write binding_proof with length prefix
    const proofLengthBytes = new Uint8Array(new Uint32Array([binding.binding_proof.length]).buffer);
    result.set(proofLengthBytes, offset);
    offset += 4;
    result.set(binding.binding_proof, offset);
    offset += binding.binding_proof.length;
    
    // Write verified_at
    const verifiedAtBytes = new Uint8Array(new BigUint64Array([binding.verified_at]).buffer);
    result.set(verifiedAtBytes, offset);
    offset += 8;
    
    // Write status
    result[offset] = binding.status;
    offset += 1;
    
    // Write api_key_hash (optional)
    if (binding.api_key_hash) {
      result[offset] = 1; // Has api_key_hash
      offset += 1;
      result.set(binding.api_key_hash, offset);
    } else {
      result[offset] = 0; // No api_key_hash
    }
    
    return result;
  }

  static decode(bytes: ccc.BytesLike): AddressBindingData {
    const data = ccc.bytesFrom(bytes);
    let offset = 0;
    
    // Read user_lock_hash
    const user_lock_hash = data.slice(offset, offset + 32);
    offset += 32;
    
    // Read credential
    const credLength = new Uint32Array(data.slice(offset, offset + 4).buffer)[0];
    offset += 4;
    const credentialBytes = data.slice(offset, offset + credLength);
    const webauthn_credential = WebAuthnCredential.decode(credentialBytes);
    offset += credLength;
    
    // Read binding_proof
    const proofLength = new Uint32Array(data.slice(offset, offset + 4).buffer)[0];
    offset += 4;
    const binding_proof = data.slice(offset, offset + proofLength);
    offset += proofLength;
    
    // Read verified_at
    const verified_at = new BigUint64Array(data.slice(offset, offset + 8).buffer)[0];
    offset += 8;
    
    // Read status
    const status = data[offset];
    offset += 1;
    
    // Read api_key_hash (optional)
    const hasApiKey = data[offset];
    offset += 1;
    const api_key_hash = hasApiKey ? data.slice(offset, offset + 32) : null;
    
    return new AddressBindingData({
      user_lock_hash,
      webauthn_credential,
      binding_proof,
      verified_at,
      status,
      api_key_hash,
    });
  }
}

// Export all types
export type * from "@ckb-ccc/core";
