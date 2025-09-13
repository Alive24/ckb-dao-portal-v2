import { NextRequest, NextResponse } from 'next/server';

interface CompleteBindingRequest {
  userId: string;
  bindingToken: string;
  walletAddress: string;
  signature: string;
  message?: string;
}

// In production, store these in a database
// Note: Using global to share state between API routes in development
let pendingBindings: Map<string, any>;
let completedBindings: Map<string, any>;

// Initialize shared storage
if (typeof global !== 'undefined') {
  global.pendingBindings = global.pendingBindings || new Map<string, any>();
  global.completedBindings = global.completedBindings || new Map<string, any>();
  pendingBindings = global.pendingBindings;
  completedBindings = global.completedBindings;
} else {
  pendingBindings = new Map<string, any>();
  completedBindings = new Map<string, any>();
}

export async function POST(request: NextRequest) {
  try {
    const body: CompleteBindingRequest = await request.json();

    // Validate required fields
    if (!body.userId || !body.bindingToken || !body.walletAddress || !body.signature) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields",
      }, { status: 400 });
    }

    // Validate binding token (in production, check database)
    const tokenKey = `binding_${body.userId}`;
    if (!pendingBindings.has(tokenKey) || pendingBindings.get(tokenKey) !== body.bindingToken) {
      return NextResponse.json({
        success: false,
        error: "Invalid or expired binding token",
      }, { status: 400 });
    }

    // TODO: Verify wallet signature here
    // In a real implementation, this would:
    // 1. Verify that the signature is valid for the wallet address
    // 2. Check that the message contains the binding token
    // 3. Validate the message format

    // For now, simulate signature verification
    const isValidSignature = body.signature.length > 10; // Mock validation

    if (!isValidSignature) {
      return NextResponse.json({
        success: false,
        error: "Invalid signature",
      }, { status: 400 });
    }

    // Create binding record
    const bindingData = {
      userId: body.userId,
      walletAddress: body.walletAddress,
      signature: body.signature,
      message: body.message,
      createdAt: new Date().toISOString(),
      status: 'verified',
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock transaction hash
    };

    // Store completed binding
    completedBindings.set(body.walletAddress, bindingData);

    // Clean up pending binding
    pendingBindings.delete(tokenKey);

    // TODO: Create actual CKB transaction here
    // This would involve:
    // 1. Creating a binding cell with the WebAuthn credential
    // 2. Submitting the transaction to the CKB network
    // 3. Storing the transaction hash

    return NextResponse.json({
      success: true,
      txHash: bindingData.txHash,
      status: 'verified',
      walletAddress: body.walletAddress,
    });
  } catch (error) {
    console.error("Error completing binding:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
}

// Store pending binding token
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, bindingToken } = body;

    if (!userId || !bindingToken) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields",
      }, { status: 400 });
    }

    // Store pending binding token (in production, use database with TTL)
    const tokenKey = `binding_${userId}`;
    pendingBindings.set(tokenKey, bindingToken);

    return NextResponse.json({
      success: true,
      message: "Binding token stored",
    });
  } catch (error) {
    console.error("Error storing binding token:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
}