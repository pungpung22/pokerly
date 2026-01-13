import { logEvent, Analytics } from 'firebase/analytics';
import { analytics } from './firebase';

// GA4 커스텀 이벤트 유틸리티

/**
 * "무료로 시작하기" 버튼 클릭 이벤트
 */
export function trackStartFreeTrial(location: string = 'unknown') {
  if (analytics) {
    logEvent(analytics as Analytics, 'start_free_trial', {
      button_location: location,
      page_title: typeof document !== 'undefined' ? document.title : '',
    });
  }
}

/**
 * 세션 기록 완료 이벤트
 */
export function trackSessionRecorded(sessionData: {
  gameType: 'cash' | 'tournament';
  method: 'ocr' | 'manual';
  profit?: number;
}) {
  if (analytics) {
    logEvent(analytics as Analytics, 'session_recorded', {
      game_type: sessionData.gameType,
      recording_method: sessionData.method,
      is_profitable: sessionData.profit !== undefined ? sessionData.profit > 0 : undefined,
    });
  }
}

/**
 * 로그인 완료 이벤트
 */
export function trackLogin(method: string = 'google') {
  if (analytics) {
    logEvent(analytics as Analytics, 'login', {
      method: method,
    });
  }
}

/**
 * 회원가입 완료 이벤트
 */
export function trackSignUp(method: string = 'google') {
  if (analytics) {
    logEvent(analytics as Analytics, 'sign_up', {
      method: method,
    });
  }
}

/**
 * 페이지 뷰 이벤트 (커스텀)
 */
export function trackPageView(pageName: string, locale: string) {
  if (analytics) {
    logEvent(analytics as Analytics, 'page_view', {
      page_name: pageName,
      page_locale: locale,
    });
  }
}

/**
 * OCR 업로드 이벤트
 */
export function trackOCRUpload(fileCount: number, success: boolean) {
  if (analytics) {
    logEvent(analytics as Analytics, 'ocr_upload', {
      file_count: fileCount,
      success: success,
    });
  }
}

/**
 * 챌린지 참여 이벤트
 */
export function trackChallengeJoined(challengeType: string) {
  if (analytics) {
    logEvent(analytics as Analytics, 'challenge_joined', {
      challenge_type: challengeType,
    });
  }
}

/**
 * 레벨업 이벤트
 */
export function trackLevelUp(newLevel: number) {
  if (analytics) {
    logEvent(analytics as Analytics, 'level_up', {
      new_level: newLevel,
    });
  }
}
