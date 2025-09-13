import { NextRequest, NextResponse } from 'next/server';

// In production, store these in a database
// Note: This needs to be shared with the complete endpoint
let completedBindings: Map<string, any>;

// Initialize shared storage
if (typeof global !== 'undefined') {
  global.completedBindings = global.completedBindings || new Map<string, any>();
  completedBindings = global.completedBindings;
} else {
  completedBindings = new Map<string, any>();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('address');
    const userId = searchParams.get('userId');

    if (!walletAddress && !userId) {
      return NextResponse.json({
        success: false,
        error: "Either address or userId is required",
      }, { status: 400 });
    }

    // Find binding by wallet address
    if (walletAddress) {
      const binding = completedBindings.get(walletAddress);
      
      if (!binding) {
        return NextResponse.json({
          success: true,
          status: 'none',
          message: 'No binding found for this address',
        });
      }

      return NextResponse.json({
        success: true,
        status: binding.status,
        walletAddress: binding.walletAddress,
        userId: binding.userId,
        txHash: binding.txHash,
        createdAt: binding.createdAt,
      });
    }

    // Find bindings by user ID
    if (userId) {
      const userBindings = [];
      for (const [address, binding] of completedBindings.entries()) {
        if (binding.userId === userId) {
          userBindings.push({
            walletAddress: address,
            status: binding.status,
            txHash: binding.txHash,
            createdAt: binding.createdAt,
          });
        }
      }

      return NextResponse.json({
        success: true,
        userId,
        bindings: userBindings,
        count: userBindings.length,
      });
    }

    return NextResponse.json({
      success: false,
      error: "Invalid request parameters",
    }, { status: 400 });
  } catch (error) {
    console.error("Error checking binding status:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('address');

    if (!walletAddress) {
      return NextResponse.json({
        success: false,
        error: "Wallet address is required",
      }, { status: 400 });
    }

    // Check if binding exists
    if (!completedBindings.has(walletAddress)) {
      return NextResponse.json({
        success: false,
        error: "No binding found for this address",
      }, { status: 404 });
    }

    // Remove binding (in production, this would create a revocation transaction)
    completedBindings.delete(walletAddress);

    return NextResponse.json({
      success: true,
      message: "Binding revoked successfully",
      walletAddress,
    });
  } catch (error) {
    console.error("Error revoking binding:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
}