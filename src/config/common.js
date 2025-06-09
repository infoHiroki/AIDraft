// 共通設定
const COMMON_CONFIG = {
  // OpenAI API設定
  OPENAI: {
    MODEL: 'gpt-4o-mini',
    MAX_TOKENS: 500,
    TEMPERATURE: 0.7,
    API_URL: 'https://api.openai.com/v1/chat/completions'
  },
  
  // エラーハンドリング
  ERROR_MESSAGES: {
    NO_API_KEY: 'APIキーが設定されていません',
    SHEET_NOT_FOUND: 'シートが見つかりません',
    API_ERROR: 'API Error'
  },
  
  // 共通ステータス
  STATUS: {
    PENDING: '',
    PROCESSING: '処理中',
    COMPLETED: 'AI下書き作成済',
    ERROR: 'エラー',
    TEST: 'テスト実行'
  }
};