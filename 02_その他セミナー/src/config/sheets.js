// スプレッドシート設定
const SHEET_CONFIGS = {
  // その他セミナーシート
  OTHER_SEMINAR: {
    SHEET_ID: '1PPwXbBGdSLIC8yeQY33dNDlEqjdJ4X-PibaDPiWU6Io',
    SHEET_NAME: 'その他セミナー',
    COLUMNS: {
      TIMESTAMP: 0,       // A列: Timestamp
      EMAIL: 1,           // B列: Email Address
      CLINIC_NAME: 2,     // C列: 先生の歯科医院名
      DOCTOR_NAME: 3,     // D列: 先生のお名前
      IMPRESSION: 4,      // E列: セミナーの感想をお聞かせください
      STATUS: 5,          // F列: 事務局対応
      QUESTION: 6,        // G列: 質問があれば教えてください ← 処理対象
    },
    MAX_ROWS_PER_RUN: 20,
    LABEL_NAME: 'AI自動回答_その他セミナー'
  }
};