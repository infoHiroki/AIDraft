/**
 * シート設定ファイル
 * 統合スプレッドシートの各シート設定
 */

const SHEET_CONFIG = {
  // 統合スプレッドシートID
  SPREADSHEET_ID: '1tBCljX_ygj8HlqAxvb7SFv6QBnNMj-zdWc1KZAKCJ-M',
  
  // 各シートの設定
  SHEETS: {
    WEEKEND: {
      sheetName: 'WeekendDent',
      description: 'WeekendDentセミナーアンケート',
      columns: {
        timestamp: 'A',
        email: 'B', 
        doctorName: 'C',
        seminarType: 'D',
        impression: 'E',
        question: 'F',
        status: 'G',
        aiResponse: 'H'
      },
      labelName: 'AI自動回答_WeekendEnt',
      subjectPrefix: 'WeekendDentセミナー',
      // 処理条件: F列に質問があり、G列（ステータス）が空
      questionColumn: 'F',
      statusColumn: 'G',
      outputColumn: 'H'
    },
    
    OTHER: {
      sheetName: 'その他単発セミナー回答',
      description: 'その他セミナーアンケート',
      columns: {
        // A, B列は空
        clinicName: 'C',
        doctorName: 'D', 
        summary: 'E',
        question: 'F',
        status: 'G',
        aiResponse: 'H'
      },
      labelName: 'AI自動回答_その他',
      subjectPrefix: 'その他セミナー',
      // 処理条件: F列に質問があり、G列（ステータス）が空
      questionColumn: 'F', 
      statusColumn: 'G',
      outputColumn: 'H'
    },
    
    INQUIRY: {
      sheetName: '#GDX、ウィークエンデント、単発、黒飛出演',
      description: 'お問い合わせフォーム',
      columns: {
        // A列は空
        doctorName: 'B',
        position: 'C',
        clinicName: 'D',
        summary: 'E',
        question: 'F',
        status: 'G',
        // 注意: お問い合わせのみH列に事務局対応
        aiResponse: 'H'
      },
      labelName: 'AI自動回答_お問い合わせ',
      subjectPrefix: 'お問い合わせ',
      // 処理条件: F列に質問があり、H列（ステータス）が空 ※他と異なる
      questionColumn: 'F',
      statusColumn: 'H',  // 注意: お問い合わせのみH列
      outputColumn: 'I'   // 注意: お問い合わせのみI列
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