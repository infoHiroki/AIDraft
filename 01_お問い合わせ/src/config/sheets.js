// スプレッドシート設定
const SHEET_CONFIGS = {
  // 歯科セミナー問い合わせ
  DENTAL_SEMINAR: {
    SHEET_ID: '159ftLgPcrqdQU-W5UqpPcgrrZGado12kocXGFVnhzXI',
    SHEET_NAME: 'フォームの回答 1',
    COLUMNS: {
      TIMESTAMP: 0,      // A列: タイムスタンプ
      EMAIL: 1,          // B列: メールアドレス
      CLINIC_NAME: 2,    // C列: 医院名
      DOCTOR_NAME: 3,    // D列: 院長名
      SEMINAR_NAME: 4,   // E列: セミナー名
      QUESTION: 5,       // F列: 質問内容
      STATUS: 6,         // G列: 事務局対応
      TIMESTAMP_PROCESSED: 7, // H列: 処理日時
      DRAFT_ID: 8,       // I列: 下書きID
      AI_RESPONSE: 9     // J列: AI返信文
    },
    MAX_ROWS_PER_RUN: 20,
    LABEL_NAME: 'AI自動回答_お問い合わせ'
  },
  
  // WeekendEnアンケート（後で追加）
  WEEKEND_EN: {
    SHEET_ID: '13-tj5YmUov8m3PbVvRO2XFCzMKb3YGJT4TG0tPz_rfo',
    SHEET_NAME: 'フォームの回答 1',
    COLUMNS: {
      // 後で定義
    },
    MAX_ROWS_PER_RUN: 20,
    LABEL_NAME: 'AI自動下書き_WeekendEn'
  }
};