// 共通設定
const COMMON_CONFIG = {
  // OpenAI設定
  OPENAI: {
    MODEL: 'gpt-4o-mini',
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.7
  },
  
  // 処理制限
  MAX_EMAILS_PER_RUN: 10,
  
  // ステータス
  STATUS: {
    COMPLETED: '完了',
    ERROR: 'エラー',
    TEST: 'テスト実行'
  },
  
  // エラーメッセージ
  ERROR_MESSAGES: {
    API_KEY_MISSING: 'OpenAI APIキーが設定されていません',
    EMAIL_NOT_FOUND: '対象メールが見つかりません',
    LABEL_NOT_FOUND: '指定されたラベルが存在しません',
    DRAFT_CREATION_FAILED: 'Gmail下書きの作成に失敗しました'
  }
};