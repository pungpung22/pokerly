import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { AuthProvider } from '../../entities/user.entity';

export class CreateUserDto {
  @IsString()
  firebaseUid: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsEnum(AuthProvider)
  @IsOptional()
  provider?: AuthProvider;
}

export class CreateUserFromFirebaseDto {
  firebaseUid: string;
  email: string;
  displayName?: string;
  photoUrl?: string | null;
  provider?: 'google' | 'apple' | 'email';
}
