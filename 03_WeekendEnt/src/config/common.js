// 共通設定
const COMMON_CONFIG = {
  // OpenAI API設定
  OPENAI: {
    API_URL: 'https://api.openai.com/v1/chat/completions',
    MODEL: 'gpt-4o-mini',
    MAX_TOKENS: 1000,
    TEMPERATURE: 0.7
  },
  
  // ステータス定義
  STATUS: {
    PENDING: '',
    COMPLETED: '完了',
    ERROR: 'エラー',
    TEST: 'テスト実行'
  },
  
  // エラーメッセージ
  ERROR_MESSAGES: {
    NO_API_KEY: 'OpenAI APIキーが設定されていません',
    SHEET_NOT_FOUND: '指定されたシートが見つかりません',
    API_ERROR: 'API呼び出しでエラーが発生しました',
    INVALID_CONFIG: '設定が正しくありません'
  }
};