import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { UploadsService, ScreenshotResult } from './uploads.service';

@Controller('uploads')
@UseGuards(FirebaseAuthGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('screenshot')
  @UseInterceptors(FileInterceptor('file'))
  async uploadScreenshot(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ScreenshotResult> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.uploadsService.processScreenshot(user.id, file);
  }

  @Post('screenshots')
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploadScreenshots(
    @CurrentUser() user: User,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ results: ScreenshotResult[]; totalProcessed: number }> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    if (files.length > 5) {
      throw new BadRequestException('Maximum 5 files allowed');
    }

    return this.uploadsService.processScreenshots(user.id, files);
  }
}
