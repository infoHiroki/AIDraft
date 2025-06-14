// スプレッドシート設定
const SHEET_CONFIGS = {
  // WeekendEntシート
  WEEKEND_ENT: {
    SHEET_ID: '1PPwXbBGdSLIC8yeQY33dNDlEqjdJ4X-PibaDPiWU6Io',
    SHEET_NAME: 'WeekenDent',
    COLUMNS: {
      CONTENT: 0,         // A列: 内容
      TIMESTAMP: 1,       // B列: タイムスタンプ
      EMAIL: 2,           // C列: メールアドレス
      CLINIC_NAME: 3,     // D列: 歯科医院名
      DOCTOR_NAME: 4,     // E列: 先生のお名前
      IMPRESSION: 5,      // F列: セミナー感想
      QUESTION: 6,        // G列: 質問があれば教えてください ← 処理対象
      STATUS: 7,          // H列: 事務局対応
      AI_RESPONSE: 8      // I列: AI回答 ← 出力先
    },
    MAX_ROWS_PER_RUN: 20,
    LABEL_NAME: 'AI自動回答_WeekendEnt'
  }
};