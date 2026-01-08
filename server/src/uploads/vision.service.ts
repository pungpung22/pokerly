import { Injectable, Logger } from '@nestjs/common';
import { ImageAnnotatorClient } from '@google-cloud/vision';

export interface PokerSessionData {
  gameType?: 'cash' | 'tournament';
  stakes?: string;
  buyIn?: number;
  cashOut?: number;
  profit?: number;
  hands?: number;
  playTime?: number;
  date?: string;
  venue?: string;
  tableId?: string;
  rawText: string;
}

@Injectable()
export class VisionService {
  private readonly logger = new Logger(VisionService.name);
  private client: ImageAnnotatorClient;

  constructor() {
    // GCP credentials는 환경변수 GOOGLE_APPLICATION_CREDENTIALS로 설정
    // 또는 .env에 GOOGLE_CLOUD_PROJECT, GOOGLE_CLOUD_KEYFILE 설정
    try {
      this.client = new ImageAnnotatorClient();
      this.logger.log('Google Cloud Vision client initialized');
    } catch (error) {
      this.logger.warn(
        'Google Cloud Vision client not initialized. Set GOOGLE_APPLICATION_CREDENTIALS',
      );
    }
  }

  async extractTextFromImage(imagePath: string): Promise<string> {
    if (!this.client) {
      throw new Error('Vision client not initialized');
    }

    try {
      const [result] = await this.client.textDetection(imagePath);
      const detections = result.textAnnotations;

      if (!detections || detections.length === 0) {
        return '';
      }

      // 첫 번째 항목이 전체 텍스트
      return detections[0].description || '';
    } catch (error) {
      this.logger.error(`Failed to extract text: ${error.message}`);
      throw error;
    }
  }

  async parsePokerScreenshot(imagePath: string): Promise<PokerSessionData> {
    const rawText = await this.extractTextFromImage(imagePath);
    this.logger.debug(`Extracted text: ${rawText}`);

    // 기본 파싱 로직 (추후 LLM으로 개선 가능)
    const data: PokerSessionData = {
      rawText,
    };

    // 금액 패턴 찾기 (숫자 + 원/₩/만/억 등)
    const moneyPatterns = rawText.match(/[\d,]+(?:\.\d+)?(?:원|₩|만|억)?/g);
    if (moneyPatterns) {
      this.logger.debug(`Found money patterns: ${moneyPatterns.join(', ')}`);
    }

    // 게임 타입 감지
    if (/토너먼트|tournament|mtt|sit.*go/i.test(rawText)) {
      data.gameType = 'tournament';
    } else if (/캐시|cash|ring|홀덤/i.test(rawText)) {
      data.gameType = 'cash';
    }

    // 스테이크 패턴 (예: 1/2, 2/5, 500/1000)
    const stakesMatch = rawText.match(/(\d+)\s*[\/\\]\s*(\d+)/);
    if (stakesMatch) {
      data.stakes = `${stakesMatch[1]}/${stakesMatch[2]}`;
    }

    // 바이인 패턴
    const buyInMatch = rawText.match(/바이인|buy.?in|입금[:\s]*[\₩]?([\d,]+)/i);
    if (buyInMatch) {
      data.buyIn = this.parseKoreanNumber(buyInMatch[1]);
    }

    // 캐시아웃 패턴
    const cashOutMatch = rawText.match(
      /캐시아웃|cash.?out|출금|정산[:\s]*[\₩]?([\d,]+)/i,
    );
    if (cashOutMatch) {
      data.cashOut = this.parseKoreanNumber(cashOutMatch[1]);
    }

    // 수익 패턴
    const profitMatch = rawText.match(/수익|profit|손익[:\s]*([+-]?[\d,]+)/i);
    if (profitMatch) {
      data.profit = this.parseKoreanNumber(profitMatch[1]);
    }

    // 핸드 수 패턴
    const handsMatch = rawText.match(/(\d+)\s*(?:핸드|hands|게임)/i);
    if (handsMatch) {
      data.hands = parseInt(handsMatch[1], 10);
    }

    // 플레이 시간 패턴 (예: 2시간 30분, 2h 30m)
    const timeMatch = rawText.match(
      /(\d+)\s*(?:시간|h|hour)(?:\s*(\d+)\s*(?:분|m|min))?/i,
    );
    if (timeMatch) {
      const hours = parseInt(timeMatch[1], 10);
      const minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
      data.playTime = hours * 60 + minutes;
    }

    // 날짜 패턴
    const dateMatch = rawText.match(
      /(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})/,
    );
    if (dateMatch) {
      data.date = `${dateMatch[1]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[3].padStart(2, '0')}`;
    }

    // 수익 계산 (바이인, 캐시아웃 있으면)
    if (data.buyIn && data.cashOut && !data.profit) {
      data.profit = data.cashOut - data.buyIn;
    }

    return data;
  }

  private parseKoreanNumber(str: string): number {
    if (!str) return 0;

    // 쉼표 제거
    let numStr = str.replace(/,/g, '');

    // 한글 단위 처리
    if (numStr.includes('억')) {
      const parts = numStr.split('억');
      let result = parseInt(parts[0], 10) * 100000000;
      if (parts[1]) {
        const manMatch = parts[1].match(/(\d+)만?/);
        if (manMatch) {
          result += parseInt(manMatch[1], 10) * 10000;
        }
      }
      return result;
    }

    if (numStr.includes('만')) {
      return parseInt(numStr.replace('만', ''), 10) * 10000;
    }

    return parseInt(numStr, 10) || 0;
  }
}
