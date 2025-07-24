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
      // G列: ステータス更新
      sheet.getRange(rowIndex, 7).setValue(status);
      
      // H列: 統合情報（日時 + ID + 返信文）
      if (timestamp || draftId || aiResponse) {
        let combinedInfo = '';
        
        if (timestamp) {
          combinedInfo += `${Utilities.formatDate(timestamp, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm')}\n`;
        }
        
        if (draftId) {
          combinedInfo += `Draft ID: ${draftId}\n`;
        }
        
        if (aiResponse) {
          combinedInfo += `────────────────\n${aiResponse}`;
        }
        
        sheet.getRange(rowIndex, 8).setValue(combinedInfo);
      }
      
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