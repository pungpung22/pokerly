import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from '../firebase.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private firebaseService: FirebaseService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      const decodedToken = await this.firebaseService.verifyIdToken(token);

      // Find or create user
      let user = await this.usersService.findByFirebaseUid(decodedToken.uid);

      if (!user) {
        user = await this.usersService.createFromFirebase({
          firebaseUid: decodedToken.uid,
          email: decodedToken.email || '',
          displayName: decodedToken.name || decodedToken.email?.split('@')[0] || 'Player',
          photoUrl: decodedToken.picture || null,
          provider: this.getProviderFromFirebase(decodedToken.firebase?.sign_in_provider),
        });
      }

      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private getProviderFromFirebase(signInProvider?: string): 'google' | 'apple' | 'email' {
    if (signInProvider === 'google.com') return 'google';
    if (signInProvider === 'apple.com') return 'apple';
    return 'email';
  }
}
