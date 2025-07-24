/**
 * スプレッドシートサービス
 * 統合版 - 固定列マッピングに対応
 */
class SheetService {
  
  /**
   * シートを取得
   * @param {string} sheetId - スプレッドシートID
   * @param {string} sheetName - シート名
   * @returns {Sheet} シートオブジェクト
   */
  static getSheet(sheetId, sheetName) {
    try {
      const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
      if (!sheet) {
        throw new Error(`${COMMON_CONFIG.ERROR_MESSAGES.SHEET_NOT_FOUND}: ${sheetName}`);
      }
      console.log(`シート取得成功: ${sheetName}`);
      return sheet;
    } catch (error) {
      console.error(`シート取得エラー (ID: ${sheetId}, Name: ${sheetName}):`, error);
      throw error;
    }
  }
  
  /**
   * 設定確認
   * @param {string} sheetType - シートタイプ
   * @returns {Object} 確認結果
   */
  static checkConfig(sheetType) {
    try {
      const config = getSheetConfig(sheetType);
      const sheet = this.getSheet(SHEET_CONFIG.SPREADSHEET_ID, config.sheetName);
      
      const result = {
        sheetType: sheetType,
        sheetName: config.sheetName,
        accessible: true,
        rowCount: sheet.getLastRow(),
        columnCount: sheet.getLastColumn(),
        config: config
      };
      
      console.log(`${config.description} 設定確認完了:`, result);
      return result;
      
    } catch (error) {
      console.error(`設定確認エラー (${sheetType}):`, error);
      return {
        sheetType: sheetType,
        accessible: false,
        error: error.message
      };
    }
  }
  
  /**
   * 全シートの設定確認
   * @returns {Array} 全シートの確認結果
   */
  static checkAllConfigs() {
    const results = [];
    const sheetTypes = Object.keys(SHEET_CONFIG.SHEETS);
    
    console.log('=== 全シート設定確認 ===');
    
    for (const sheetType of sheetTypes) {
      results.push(this.checkConfig(sheetType));
    }
    
    console.log('設定確認完了:', results);
    return results;
  }
  
  /**
   * 未処理行を取得
   * @param {Sheet} sheet - シートオブジェクト  
   * @param {Object} config - シート設定
   * @returns {Array} 未処理行の配列
   */
  static getUnprocessedRows(sheet, config) {
    const data = sheet.getDataRange().getValues();
    const unprocessedRows = [];
    
    const questionIndex = this.getColumnIndex(config.questionColumn);
    const statusIndex = this.getColumnIndex(config.statusColumn);
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // 質問列にデータがあり、ステータス列が空なら未処理
      if (row[questionIndex] && row[questionIndex].toString().trim() !== '' && 
          (!row[statusIndex] || row[statusIndex] === '')) {
        unprocessedRows.push({
          rowIndex: i + 1,
          data: row
        });
      }
    }
    
    return unprocessedRows;
  }
  
  /**
   * 列文字を数値インデックスに変換
   * @param {string} column - 列文字（A, B, C...）
   * @returns {number} 0から始まるインデックス
   */
  static getColumnIndex(column) {
    return column.charCodeAt(0) - 'A'.charCodeAt(0);
  }
}