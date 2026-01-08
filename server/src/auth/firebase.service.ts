import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
    const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      console.warn('Firebase credentials not configured. Using mock auth for development.');
      return;
    }

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    if (!this.firebaseApp) {
      // Development mode: decode JWT without verification to get real user info
      try {
        const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
        return {
          uid: payload.user_id || payload.sub || 'dev-user-123',
          email: payload.email || 'dev@example.com',
          name: payload.name || payload.email?.split('@')[0] || 'Dev User',
          picture: payload.picture,
          aud: payload.aud || 'dev',
          auth_time: payload.auth_time || Math.floor(Date.now() / 1000),
          exp: payload.exp || Math.floor(Date.now() / 1000) + 3600,
          iat: payload.iat || Math.floor(Date.now() / 1000),
          iss: payload.iss || 'dev',
          sub: payload.sub || 'dev-user-123',
          firebase: {
            sign_in_provider: payload.firebase?.sign_in_provider || 'google.com',
            identities: payload.firebase?.identities || {},
          },
        } as admin.auth.DecodedIdToken;
      } catch {
        // Fallback to static mock user if JWT parsing fails
        return {
          uid: 'dev-user-123',
          email: 'dev@example.com',
          name: 'Dev User',
          picture: undefined,
          aud: 'dev',
          auth_time: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600,
          iat: Math.floor(Date.now() / 1000),
          iss: 'dev',
          sub: 'dev-user-123',
          firebase: {
            sign_in_provider: 'google.com',
            identities: {},
          },
        } as admin.auth.DecodedIdToken;
      }
    }

    return admin.auth().verifyIdToken(idToken);
  }

  async getUser(uid: string): Promise<admin.auth.UserRecord | null> {
    if (!this.firebaseApp) {
      return null;
    }

    try {
      return await admin.auth().getUser(uid);
    } catch {
      return null;
    }
  }
}
