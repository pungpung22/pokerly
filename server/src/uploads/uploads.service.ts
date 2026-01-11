import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { VisionService, PokerSessionData } from './vision.service';
import { Session } from '../entities/session.entity';

export interface ScreenshotResult {
  filename: string;
  originalName: string;
  path: string;
  size: number;
  status: 'success' | 'pending_ocr' | 'ocr_complete' | 'ocr_failed' | 'duplicate';
  message: string;
  extractedData?: PokerSessionData;
  imageHash?: string;
  isDuplicate?: boolean;
  duplicateSessionId?: string;
}

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  private readonly uploadsDir = './uploads';

  constructor(
    private readonly visionService: VisionService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {
    // Ensure uploads directory exists
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  /**
   * 이미지 파일의 MD5 해시를 계산
   */
  private calculateImageHash(filePath: string): string {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(fileBuffer).digest('hex');
  }

  /**
   * 이미지 해시로 중복 검사
   */
  async checkDuplicateByHash(userId: string, imageHash: string): Promise<Session | null> {
    return this.sessionRepository.findOne({
      where: { userId, imageHash },
    });
  }

  /**
   * OCR 텍스트로 중복 검사 (rawText가 80% 이상 일치하면 중복으로 간주)
   */
  async checkDuplicateByText(userId: string, rawText: string): Promise<Session | null> {
    if (!rawText || rawText.length < 50) return null;

    const recentSessions = await this.sessionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 20, // 최근 20개 세션만 검사
    });

    for (const session of recentSessions) {
      if (session.rawText && this.calculateSimilarity(rawText, session.rawText) > 0.8) {
        return session;
      }
    }
    return null;
  }

  /**
   * 두 문자열의 유사도 계산 (Jaccard 유사도)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const set1 = new Set(str1.split(/\s+/));
    const set2 = new Set(str2.split(/\s+/));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
  }

  /**
   * WPL 기준 세션 데이터로 중복 검사
   * - 캐시게임: 날짜 + 시작시간 + 게임타입 + 테이블ID
   * - 토너먼트: 날짜 + 시작시간 + 토너먼트 이름
   */
  async checkDuplicateBySessionData(
    userId: string,
    data: PokerSessionData,
  ): Promise<Session | null> {
    if (!data.date || !data.venue) return null;

    const whereCondition: any = {
      userId,
      date: data.date,
      venue: data.venue,
    };

    // 게임 타입별 추가 조건
    if (data.gameType === 'tournament') {
      // 토너먼트: 날짜 + 시작시간 + 토너먼트 이름(venue)
      whereCondition.gameType = 'tournament';
    } else {
      // 캐시게임: 날짜 + 시작시간 + 게임타입 + 테이블ID(venue)
      whereCondition.gameType = 'cash';
      if (data.stakes) {
        whereCondition.stakes = data.stakes;
      }
    }

    return this.sessionRepository.findOne({ where: whereCondition });
  }

  async processScreenshot(
    userId: string,
    file: Express.Multer.File,
  ): Promise<ScreenshotResult> {
    this.logger.log(`Processing screenshot for user ${userId}: ${file.originalname}`);

    // 1. 이미지 해시 계산
    const imageHash = this.calculateImageHash(file.path);
    this.logger.debug(`Image hash: ${imageHash}`);

    // 2. 해시로 중복 검사
    const duplicateByHash = await this.checkDuplicateByHash(userId, imageHash);
    if (duplicateByHash) {
      this.logger.warn(`Duplicate screenshot detected by hash: ${duplicateByHash.id}`);
      // 중복 파일 삭제
      fs.unlinkSync(file.path);
      return {
        filename: file.filename,
        originalName: file.originalname,
        path: '',
        size: file.size,
        status: 'duplicate',
        message: '이미 업로드된 스크린샷입니다.',
        imageHash,
        isDuplicate: true,
        duplicateSessionId: duplicateByHash.id,
      };
    }

    try {
      // 3. OCR 처리
      const extractedData = await this.visionService.parsePokerScreenshot(file.path);

      // 4. WPL 기준 세션 데이터로 중복 검사 (날짜+장소+게임타입+스테이크)
      const duplicateBySession = await this.checkDuplicateBySessionData(userId, extractedData);
      if (duplicateBySession) {
        this.logger.warn(`Duplicate session detected by WPL criteria: ${duplicateBySession.id}`);
        fs.unlinkSync(file.path);
        return {
          filename: file.filename,
          originalName: file.originalname,
          path: '',
          size: file.size,
          status: 'duplicate',
          message: '동일한 세션이 이미 등록되어 있습니다.',
          imageHash,
          isDuplicate: true,
          duplicateSessionId: duplicateBySession.id,
          extractedData,
        };
      }

      // 5. OCR 텍스트로 중복 검사 (fallback)
      const duplicateByText = await this.checkDuplicateByText(userId, extractedData.rawText);
      if (duplicateByText) {
        this.logger.warn(`Duplicate screenshot detected by OCR text: ${duplicateByText.id}`);
        fs.unlinkSync(file.path);
        return {
          filename: file.filename,
          originalName: file.originalname,
          path: '',
          size: file.size,
          status: 'duplicate',
          message: '비슷한 내용의 스크린샷이 이미 등록되어 있습니다.',
          imageHash,
          isDuplicate: true,
          duplicateSessionId: duplicateByText.id,
          extractedData,
        };
      }

      return {
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        status: 'ocr_complete',
        message: 'OCR 처리가 완료되었습니다.',
        extractedData,
        imageHash,
        isDuplicate: false,
      };
    } catch (error) {
      this.logger.error(`OCR failed: ${error.message}`);

      // OCR 실패해도 파일은 업로드됨
      return {
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        status: 'ocr_failed',
        message: `OCR 처리 실패: ${error.message}. 수동으로 입력해주세요.`,
        imageHash,
        isDuplicate: false,
      };
    }
  }

  async processScreenshots(
    userId: string,
    files: Express.Multer.File[],
  ): Promise<{ results: ScreenshotResult[]; totalProcessed: number }> {
    const results: ScreenshotResult[] = [];

    for (const file of files) {
      const result = await this.processScreenshot(userId, file);
      results.push(result);
    }

    return {
      results,
      totalProcessed: results.length,
    };
  }

  async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(this.uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
