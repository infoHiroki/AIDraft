// スプレッドシート設定
const SHEET_CONFIGS = {
  // WeekendEntシート
  WEEKEND_ENT: {
    SHEET_ID: '13-tj5YmUov8m3PbVvRO2XFCzMKb3YGJT4TG0tPz_rfo',
    SHEET_NAME: 'WeekendEnt',
    COLUMNS: {
      TIMESTAMP: 0,       // A列: タイムスタンプ
      EMAIL: 1,           // B列: メールアドレス
      CLINIC_NAME: 2,     // C列: 歯科医院名
      DOCTOR_NAME: 3,     // D列: 先生のお名前
      IMPRESSION: 4,      // E列: セミナー感想
      PAYMENT: 5,         // F列: お支払い方法
      QUESTION: 6,        // G列: 質問があれば教えてください ← 処理対象
      STATUS: 7,          // H列: 事務局対応
      AI_RESPONSE: 8      // I列: AI回答 ← 出力先
    },
    MAX_ROWS_PER_RUN: 20,
    LABEL_NAME: 'AI自動回答_WeekendEnt'
  }
};