/**
 * シート設定ファイル
 * 統合スプレッドシートの各シート設定
 */

const SHEET_CONFIG = {
  // 統合スプレッドシートID
  SPREADSHEET_ID: '1PPwXbBGdSLIC8yeQY33dNDlEqjdJ4X-PibaDPiWU6Io',
  
  // 各シートの設定
  SHEETS: {
    WEEKEND: {
      sheetName: 'WeekenDent',
      description: 'WeekendDentセミナーアンケート',
      labelName: 'AI自動回答_WeekendEnt',
      subjectPrefix: 'WeekendDentセミナー',
      questionColumn: 'F',
      statusColumn: 'G'
    },
    
    OTHER: {
      sheetName: 'その他セミナー',
      description: 'その他セミナーアンケート',
      labelName: 'AI自動回答_その他',
      subjectPrefix: 'その他セミナー',
      questionColumn: 'F',
      statusColumn: 'G'
    },
    
    INQUIRY: {
      sheetName: 'お問い合わせ',
      description: 'お問い合わせフォーム',
      labelName: 'AI自動回答_お問い合わせ',
      subjectPrefix: 'お問い合わせ',
      questionColumn: 'F',
      statusColumn: 'H'
    }
  }
};

/**
 * シート設定を取得
 * @param {string} sheetType - シートタイプ（'WEEKEND', 'OTHER', 'INQUIRY'）
 * @returns {Object} シート設定
 */
function getSheetConfig(sheetType) {
  if (!SHEET_CONFIG.SHEETS[sheetType]) {
    throw new Error(`Unknown sheet type: ${sheetType}`);
  }
  return SHEET_CONFIG.SHEETS[sheetType];
}

/**
 * 全シート設定を取得
 * @returns {Object} 全シート設定
 */
function getAllSheetConfigs() {
  return SHEET_CONFIG.SHEETS;
}