/**
 * 共通設定ファイル
 * すべてのシート処理で使用される共通の設定値
 */

const COMMON_CONFIG = {
  // OpenAI API設定
  OPENAI: {
    MODEL: 'gpt-4o-mini',
    MAX_TOKENS: 500,
    TEMPERATURE: 0.7,
    API_URL: 'https://api.openai.com/v1/chat/completions'
  },
  
  // 共通ステータス
  STATUS: {
    PENDING: '',
    PROCESSING: '処理中',
    COMPLETED: 'AI回答作成済',
    ERROR: 'エラー',
    TEST: 'テスト実行'
  },
  
  // エラーメッセージ
  ERROR_MESSAGES: {
    NO_API_KEY: 'APIキーが設定されていません',
    SHEET_NOT_FOUND: 'シートが見つかりません',
    API_ERROR: 'API Error',
    NO_QUESTION: '質問が見つかりません',
    GMAIL_ERROR: 'Gmail操作でエラーが発生しました'
  },
  
  // 処理制限
  LIMITS: {
    MAX_ROWS_PER_EXECUTION: 20,
    API_TIMEOUT: 30000
  }
};