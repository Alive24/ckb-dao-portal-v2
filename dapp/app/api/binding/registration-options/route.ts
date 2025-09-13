import { NextRequest, NextResponse } from 'next/server';
import {
  generateRegistrationOptions,
  GenerateRegistrationOptionsOpts,
} from '@simplewebauthn/server';

interface RegistrationOptionsRequest {
  userId: string;
  userName: string;
  userDisplayName?: string;
}

// In production, store these in a database
const userCredentials = new Map<string, any[]>();

export async function POST(request: NextRequest) {
  try {
    const body: RegistrationOptionsRequest = await request.json();

    // Validate required fields
    if (!body.userId || !body.userName) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields",
      }, { status: 400 });
    }

    // Get existing credentials for this user (if any)
    const existingCredentials = userCredentials.get(body.userId) || [];

    // Generate registration options
    const rpName = 'CKB DAO Portal';
    const rpID = request.headers.get('host')?.split(':')[0] || 'localhost';
    const userID = body.userId;
    const userName = body.userName;
    const userDisplayName = body.userDisplayName || body.userName;

    const opts: GenerateRegistrationOptionsOpts = {
      rpName,
      rpID,
      userID: new TextEncoder().encode(userID),
      userName,
      userDisplayName,
      timeout: 60000,
      attestationType: 'none',
      // Exclude existing credentials
      excludeCredentials: existingCredentials.map(cred => ({
        id: cred.credentialID,
        type: 'public-key',
        transports: cred.transports,
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
        authenticatorAttachment: 'platform',
      },
      // Support various algorithms
      supportedAlgorithmIDs: [-7, -257], // ES256, RS256
    };

    const options = await generateRegistrationOptions(opts);

    // Store challenge for verification (in production, use a database with TTL)
    const challengeKey = `challenge_${body.userId}`;
    // @ts-ignore - Using global for demo purposes
    global[challengeKey] = options.challenge;

    return NextResponse.json({
      success: true,
      options,
      challenge: options.challenge,
    });
  } catch (error) {
    console.error("Error generating registration options:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
}