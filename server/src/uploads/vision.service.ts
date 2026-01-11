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
  startTime?: string;
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

    const data: PokerSessionData = {
      rawText,
    };

    // 날짜 패턴 - 플랫폼별 파싱 전에 먼저 추출 (startTime에서 date 참조 필요)
    const dateMatch = rawText.match(
      /(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})/,
    );
    if (dateMatch) {
      data.date = `${dateMatch[1]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[3].padStart(2, '0')}`;
      this.logger.debug(`Extracted date: ${data.date}`);
    }

    // 플랫폼 감지 및 파싱
    const isWinJoy = /WINJOY|윈조이/i.test(rawText);
    const isGGPoker = /GGPoker|Session Start|Winloss|PLO\s*(Red|Blue|Green)/i.test(rawText);

    if (isWinJoy) {
      this.logger.debug('Detected WinJoy format');
      this.parseWinJoyFormat(rawText, data);
    } else if (isGGPoker) {
      this.logger.debug('Detected GGPoker format');
      this.parseGGPokerFormat(rawText, data);
    } else {
      this.parseGenericFormat(rawText, data);
    }

    // 수익 계산 (바이인, 캐시아웃 있으면)
    if (data.buyIn && data.cashOut && !data.profit) {
      data.profit = data.cashOut - data.buyIn;
    }

    // buyIn/cashOut은 스크린샷에서 알 수 없으므로 사용자가 직접 입력하도록 비워둠

    return data;
  }

  private parseWinJoyFormat(rawText: string, data: PokerSessionData): void {
    // 장소(테이블명) 추출 - 윈조이 게임 타입들
    // 홀덤, 오마하, AoF, 픽앤고, 싯앤고, 토너먼트 등
    const venueMatch = rawText.match(/((?:홀덤|오마하|Omaha|PLO|AoF|에이오에프|픽앤고|싯앤고|토너먼트|Tournament|MTT|SNG)[가-힣a-zA-Z0-9 ]*)\s*\[\d+\]/i);
    if (venueMatch) {
      data.venue = venueMatch[1].trim();
      this.logger.debug(`Extracted venue: ${data.venue}`);
    }

    // 스테이크 추출 - 장소 뒤의 블라인드
    const stakesMatch = rawText.match(/\[\d+\]\s*(\d+)\s*\/\s*(\d+)/);
    if (stakesMatch) {
      data.stakes = `${stakesMatch[1]}/${stakesMatch[2]}`;
    }

    // 게임 타입 감지 - 테이블 행의 "타입" 컬럼 값으로 판별
    // 메뉴에도 "토너먼트", "픽앤고" 등이 있으므로 전체 텍스트 검색하면 안됨
    // 테이블 구조: 타입\n게임명 [숫자] 패턴으로 찾음
    const cashTypeMatch = rawText.match(/\n(홀덤|오마하|AoF|AoF 오마하)\n/);
    const tournamentTypeMatch = rawText.match(/\n(토너먼트|픽앤고|싯앤고)\n/);

    if (tournamentTypeMatch && !cashTypeMatch) {
      data.gameType = 'tournament';
      this.logger.debug(`Detected tournament type from table: ${tournamentTypeMatch[1]}`);
    } else if (cashTypeMatch) {
      data.gameType = 'cash';
      this.logger.debug(`Detected cash type from table: ${cashTypeMatch[1]}`);
    } else if (data.venue && /토너먼트|픽앤고|싯앤고/i.test(data.venue)) {
      // fallback: venue 이름에 토너먼트 키워드가 있으면 토너먼트
      data.gameType = 'tournament';
      this.logger.debug(`Fallback: tournament detected from venue name`);
    } else {
      data.gameType = 'cash';
      this.logger.debug(`Fallback: defaulting to cash game`);
    }

    // 손익 파싱 - WinJoy 형식: "-25만 6689" 또는 "+25만 6689"
    // 반드시 +/- 부호가 있는 것만 매칭 (잔액이 아닌 손익)
    const profitMatch = rawText.match(/([+-])(\d+)만\s*(\d+)/);
    if (profitMatch) {
      const isNegative = profitMatch[1] === '-';
      const man = parseInt(profitMatch[2], 10);
      const remainder = parseInt(profitMatch[3], 10);
      data.profit = (man * 10000 + remainder) * (isNegative ? -1 : 1);
      this.logger.debug(`Extracted profit: ${data.profit}`);
    }

    // 핸드/게임 수 파싱
    const handsMatch = rawText.match(/(\d+)\s*회/);
    if (handsMatch) {
      data.hands = parseInt(handsMatch[1], 10);
    }

    // 시작 시간 파싱 - "22:44:00" 형식 (HH:MM:SS)
    const startTimeMatch = rawText.match(/(\d{1,2}:\d{2}:\d{2})/);
    if (startTimeMatch) {
      // 날짜와 결합하여 ISO 형식으로 저장
      const timeStr = startTimeMatch[1];
      if (data.date) {
        data.startTime = `${data.date}T${timeStr}`;
      }
      this.logger.debug(`Extracted startTime: ${data.startTime}`);
    }
  }

  private parseGGPokerFormat(rawText: string, data: PokerSessionData): void {
    // 게임 타입 감지 - PLO는 캐시게임, Tournament/MTT는 토너먼트
    if (/tournament|mtt|sit.*go/i.test(rawText)) {
      data.gameType = 'tournament';
    } else {
      data.gameType = 'cash';
    }

    // 테이블명 추출 - "PLO Red 06" 등
    const tableMatch = rawText.match(/(PLO|NLHE|NLH|PLO\d*)\s*([A-Za-z]+)?\s*(\d+)?/i);
    if (tableMatch) {
      data.venue = tableMatch[0].trim();
      this.logger.debug(`Extracted venue: ${data.venue}`);
    }

    // 블라인드/스테이크 추출 - "$0.10/$0.25" 형식
    const blindsMatch = rawText.match(/\$?([\d.]+)\s*\/\s*\$?([\d.]+)/);
    if (blindsMatch) {
      data.stakes = `$${blindsMatch[1]}/$${blindsMatch[2]}`;
      this.logger.debug(`Extracted stakes: ${data.stakes}`);
    }

    // Winloss (손익) 추출 - "-$23.68" 또는 "$23.68" 형식
    const winlossMatch = rawText.match(/Winloss[:\s]*([+-]?\$?[\d,.]+)/i);
    if (winlossMatch) {
      let profitStr = winlossMatch[1].replace(/[$,]/g, '');
      data.profit = parseFloat(profitStr);
      this.logger.debug(`Extracted profit: ${data.profit}`);
      // buyIn/cashOut은 사용자가 직접 입력
    }

    // 핸드 수 추출 - "Hands" 컬럼 또는 숫자
    const handsMatch = rawText.match(/Hands[:\s]*(\d+)/i);
    if (handsMatch) {
      data.hands = parseInt(handsMatch[1], 10);
      this.logger.debug(`Extracted hands: ${data.hands}`);
    }

    // Duration 추출 - "00:34:23" 형식 (HH:MM:SS)
    const durationMatch = rawText.match(/Duration[:\s]*(\d{1,2}):(\d{2}):(\d{2})/i);
    if (durationMatch) {
      const hours = parseInt(durationMatch[1], 10);
      const minutes = parseInt(durationMatch[2], 10);
      data.playTime = hours * 60 + minutes;
      this.logger.debug(`Extracted playTime: ${data.playTime} minutes`);
    }

    // 날짜 추출 - "Mar 02, 06:42" 또는 "2020-03-02" 형식
    const dateMatch = rawText.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (dateMatch) {
      data.date = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
      this.logger.debug(`Extracted date: ${data.date}`);
    }
  }

  private parseGenericFormat(rawText: string, data: PokerSessionData): void {
    // 게임 타입 감지
    if (/토너먼트|tournament|mtt|sit.*go/i.test(rawText)) {
      data.gameType = 'tournament';
    } else if (/캐시|cash|ring|홀덤/i.test(rawText)) {
      data.gameType = 'cash';
    }

    // 스테이크 패턴
    const stakesMatch = rawText.match(/(\d+)\s*\/\s*(\d+)/);
    if (stakesMatch) {
      data.stakes = `${stakesMatch[1]}/${stakesMatch[2]}`;
    }

    // 장소 추출
    const venuePatterns = [
      /장소[:\s]*([가-힣a-zA-Z\s]+)/,
      /([가-힣]+(?:홀덤|포커|클럽))/,
    ];
    for (const pattern of venuePatterns) {
      const match = rawText.match(pattern);
      if (match) {
        data.venue = match[1].trim();
        break;
      }
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
    const handsMatch = rawText.match(/(\d+)\s*(?:핸드|hands|게임|회)/i);
    if (handsMatch) {
      data.hands = parseInt(handsMatch[1], 10);
    }

    // 플레이 시간 패턴
    const timeMatch = rawText.match(
      /(\d+)\s*(?:시간|h|hour)(?:\s*(\d+)\s*(?:분|m|min))?/i,
    );
    if (timeMatch) {
      const hours = parseInt(timeMatch[1], 10);
      const minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
      data.playTime = hours * 60 + minutes;
    }
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
