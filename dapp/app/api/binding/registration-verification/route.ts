import { NextRequest, NextResponse } from 'next/server';
import {
  verifyRegistrationResponse,
  VerifyRegistrationResponseOpts,
} from '@simplewebauthn/server';

interface VerificationRequest {
  userId: string;
  registrationResponse: any;
  challenge: string;
}

// In production, store these in a database
const userCredentials = new Map<string, any[]>();

export async function POST(request: NextRequest) {
  try {
    const body: VerificationRequest = await request.json();

    // Validate required fields
    if (!body.userId || !body.registrationResponse || !body.challenge) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields",
      }, { status: 400 });
    }

    // Get expected challenge (in production, retrieve from database)
    const challengeKey = `challenge_${body.userId}`;
    // @ts-ignore - Using global for demo purposes
    const expectedChallenge = global[challengeKey];

    if (!expectedChallenge || expectedChallenge !== body.challenge) {
      return NextResponse.json({
        success: false,
        error: "Invalid or expired challenge",
      }, { status: 400 });
    }

    // Verify the registration response
    const rpName = 'CKB DAO Portal';
    const rpID = request.headers.get('host')?.split(':')[0] || 'localhost';
    const expectedOrigin = `${request.headers.get('x-forwarded-proto') || 'http'}://${request.headers.get('host') || 'localhost:3000'}`;

    const opts: VerifyRegistrationResponseOpts = {
      response: body.registrationResponse,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
      requireUserVerification: false,
    };

    const verification = await verifyRegistrationResponse(opts);

    if (verification.verified && verification.registrationInfo) {
      const { credentialID, credentialPublicKey } = verification.registrationInfo;

      // Store the credential (in production, store in database)
      const existingCredentials = userCredentials.get(body.userId) || [];
      const newCredential = {
        credentialID: Array.from(credentialID),
        credentialPublicKey: Array.from(credentialPublicKey),
        transports: body.registrationResponse.response.transports || [],
        counter: 0,
        createdAt: new Date().toISOString(),
      };

      existingCredentials.push(newCredential);
      userCredentials.set(body.userId, existingCredentials);

      // Clean up challenge
      // @ts-ignore
      delete global[challengeKey];

      // Generate binding token for wallet integration
      const bindingToken = `dao_binding_${body.userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return NextResponse.json({
        success: true,
        verified: true,
        credentialId: Array.from(credentialID),
        bindingToken,
      });
    } else {
      return NextResponse.json({
        success: false,
        verified: false,
        error: "Registration verification failed",
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying registration:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
}