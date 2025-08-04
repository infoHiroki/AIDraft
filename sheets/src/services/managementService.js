/**
 * 統合管理シートサービス
 * 処理状況の管理とデータ操作
 */
class ManagementService {
  
  /**
   * 未処理レコードを取得
   * @param {string} sheetType - シートタイプ
   * @returns {Array} 未処理レコードの配列
   */
  static getUnprocessedRecords(sheetType) {
    const config = getSheetConfig(sheetType);
    const sheet = SheetService.getSheet(SHEET_CONFIG.SPREADSHEET_ID, config.sheetName);
    const managementSheet = getManagementSheet();
    
    // 元シートから質問があるレコードを取得
    const data = sheet.getDataRange().getValues();
    const questionIndex = config.questionColumn.charCodeAt(0) - 'A'.charCodeAt(0);
    
    // 管理シートから処理済みタイムスタンプを取得
    const managementData = managementSheet.getDataRange().getValues();
    const processedTimestamps = new Set();
    
    for (let i = 1; i < managementData.length; i++) {
      const row = managementData[i];
      if (row[0] === sheetType && row[1]) { // 種別とタイムスタンプが一致
        processedTimestamps.add(row[1].toString());
      }
    }
    
    // 未処理レコードをフィルタリング
    const unprocessedRecords = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const timestamp = row[0];
      const question = row[questionIndex];
      
      // 質問があり、かつ管理シートに登録されていない場合は未処理
      if (timestamp && question && question.toString().trim() !== '' && 
          !processedTimestamps.has(timestamp.toString())) {
        unprocessedRecords.push({
          rowIndex: i + 1,
          timestamp: timestamp,
          data: row
        });
      }
    }
    
    return unprocessedRecords;
  }
  
  /**
   * 処理開始レコードを作成
   * @param {string} sheetType - シートタイプ
   * @param {string} timestamp - タイムスタンプ
   * @returns {number} 管理シートの行番号
   */
  static createProcessingRecord(sheetType, timestamp) {
    const managementSheet = getManagementSheet();
    
    managementSheet.appendRow([
      sheetType,    // A列: 種別
      timestamp,    // B列: タイムスタンプ
      '処理中'      // C列: 処理ステータス
    ]);
    
    return managementSheet.getLastRow();
  }
  
  /**
   * 処理完了の更新
   * @param {string} sheetType - シートタイプ
   * @param {string} timestamp - タイムスタンプ
   */
  static markAsCompleted(sheetType, timestamp) {
    this.updateStatus(sheetType, timestamp, '完了');
  }
  
  /**
   * 処理エラーの更新
   * @param {string} sheetType - シートタイプ
   * @param {string} timestamp - タイムスタンプ
   * @param {string} errorMessage - エラーメッセージ
   */
  static markAsError(sheetType, timestamp, errorMessage) {
    this.updateStatus(sheetType, timestamp, 'エラー');
    console.error(`処理エラー記録 (${sheetType}, ${timestamp}): ${errorMessage}`);
  }
  
  /**
   * ステータス更新
   * @param {string} sheetType - シートタイプ
   * @param {string} timestamp - タイムスタンプ
   * @param {string} status - 新しいステータス
   */
  static updateStatus(sheetType, timestamp, status) {
    const managementSheet = getManagementSheet();
    const data = managementSheet.getDataRange().getValues();
    
    // 該当レコードを検索して更新
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0] === sheetType && row[1] && row[1].toString() === timestamp.toString()) {
        managementSheet.getRange(i + 1, 3).setValue(status); // C列: 処理ステータス
        console.log(`ステータス更新: ${sheetType} ${timestamp} → ${status}`);
        return;
      }
    }
    
    console.warn(`ステータス更新対象が見つかりません: ${sheetType} ${timestamp}`);
  }
  
  /**
   * 管理シートの統計情報を取得
   * @returns {Object} 統計情報
   */
  static getStatistics() {
    const managementSheet = getManagementSheet();
    const data = managementSheet.getDataRange().getValues();
    
    const stats = {
      total: 0,
      completed: 0,
      processing: 0,
      error: 0,
      bySheetType: {}
    };
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const sheetType = row[0];
      const status = row[2];
      
      stats.total++;
      
      if (!stats.bySheetType[sheetType]) {
        stats.bySheetType[sheetType] = { total: 0, completed: 0, processing: 0, error: 0 };
      }
      stats.bySheetType[sheetType].total++;
      
      switch (status) {
        case '完了':
          stats.completed++;
          stats.bySheetType[sheetType].completed++;
          break;
        case '処理中':
          stats.processing++;
          stats.bySheetType[sheetType].processing++;
          break;
        case 'エラー':
          stats.error++;
          stats.bySheetType[sheetType].error++;
          break;
      }
    }
    
    return stats;
  }
}