// スプレッドシート サービス
class SheetService {
  
  static getSheet(sheetId, sheetName) {
    try {
      const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
      if (!sheet) {
        throw new Error(COMMON_CONFIG.ERROR_MESSAGES.SHEET_NOT_FOUND);
      }
      return sheet;
    } catch (error) {
      console.error(`シート取得エラー (ID: ${sheetId}, Name: ${sheetName}):`, error);
      throw error;
    }
  }
  
  static updateStatus(sheet, rowIndex, status, timestamp = null, draftId = null, aiResponse = null) {
    try {
      const updates = [];
      
      // ステータス更新
      updates.push({
        range: sheet.getRange(rowIndex, 7), // G列
        value: status
      });
      
      // タイムスタンプ更新
      if (timestamp) {
        updates.push({
          range: sheet.getRange(rowIndex, 8), // H列
          value: timestamp
        });
      }
      
      // 下書きID更新
      if (draftId) {
        updates.push({
          range: sheet.getRange(rowIndex, 9), // I列
          value: draftId
        });
      }
      
      // AI返信文更新
      if (aiResponse) {
        updates.push({
          range: sheet.getRange(rowIndex, 10), // J列
          value: aiResponse
        });
      }
      
      // 一括更新
      updates.forEach(update => {
        update.range.setValue(update.value);
      });
      
      return true;
    } catch (error) {
      console.error(`ステータス更新エラー (Row: ${rowIndex}):`, error);
      return false;
    }
  }
  
  static addHeaderIfNeeded(sheet, columnIndex, headerText) {
    try {
      const headerCell = sheet.getRange(1, columnIndex);
      if (!headerCell.getValue() || headerCell.getValue() !== headerText) {
        headerCell.setValue(headerText);
      }
    } catch (error) {
      console.error(`ヘッダー追加エラー (Column: ${columnIndex}):`, error);
    }
  }
}