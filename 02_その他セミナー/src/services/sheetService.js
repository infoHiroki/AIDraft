// スプレッドシート サービス
class SheetService {
  
  /**
   * ヘッダー名からカラムインデックスを取得する（キャッシュ機能付き）
   * @param {Sheet} sheet - 対象のシート
   * @param {string} headerName - 検索するヘッダー名
   * @param {Object} options - オプション設定
   * @param {number} options.headerRow - ヘッダー行番号（デフォルト: 2）
   * @param {boolean} options.createIfNotFound - 見つからない場合に新規作成するか（デフォルト: true）
   * @param {boolean} options.useCache - キャッシュを使用するか（デフォルト: true）
   * @returns {number|null} カラムインデックス（1ベース）、見つからない場合はnull
   */
  static getColumnIndexByHeader(sheet, headerName, options = {}) {
    const {
      headerRow = 2,
      createIfNotFound = true,
      useCache = true
    } = options;
    
    try {
      // キャッシュキーの生成
      const cacheKey = `${sheet.getSheetId()}_${headerName}_row${headerRow}`;
      
      // キャッシュ初期化
      if (!SheetService.columnCache) {
        SheetService.columnCache = new Map();
      }
      
      // キャッシュチェック
      if (useCache && SheetService.columnCache.has(cacheKey)) {
        const cachedIndex = SheetService.columnCache.get(cacheKey);
        // キャッシュされた位置のヘッダーが正しいか確認
        const currentHeader = sheet.getRange(headerRow, cachedIndex).getValue();
        if (currentHeader === headerName) {
          return cachedIndex;
        } else {
          // キャッシュが無効な場合は削除
          SheetService.columnCache.delete(cacheKey);
        }
      }
      
      // ヘッダー行の全データを取得
      const lastColumn = sheet.getLastColumn();
      if (lastColumn === 0) {
        // シートが空の場合
        if (createIfNotFound) {
          return this.addNewColumn(sheet, headerName, 1, headerRow);
        }
        return null;
      }
      
      const headers = sheet.getRange(headerRow, 1, 1, lastColumn).getValues()[0];
      
      // ヘッダー名でカラムを検索
      for (let i = 0; i < headers.length; i++) {
        if (headers[i] === headerName) {
          const columnIndex = i + 1; // 1ベースのインデックス
          // キャッシュに保存
          if (useCache) {
            SheetService.columnCache.set(cacheKey, columnIndex);
          }
          return columnIndex;
        }
      }
      
      // 見つからない場合
      if (createIfNotFound) {
        const newColumnIndex = lastColumn + 1;
        return this.addNewColumn(sheet, headerName, newColumnIndex, headerRow);
      }
      
      return null;
    } catch (error) {
      console.error(`カラムインデックス取得エラー (${headerName}):`, error);
      return null;
    }
  }
  
  /**
   * 新しいカラムを追加する
   * @param {Sheet} sheet - 対象のシート
   * @param {string} headerName - ヘッダー名
   * @param {number} columnIndex - カラムインデックス（1ベース）
   * @param {number} headerRow - ヘッダー行番号
   * @returns {number} 追加したカラムのインデックス
   */
  static addNewColumn(sheet, headerName, columnIndex, headerRow) {
    try {
      // 必要に応じてカラムを挿入
      const lastColumn = sheet.getLastColumn();
      if (columnIndex > lastColumn) {
        // 新しいカラムを末尾に追加
        sheet.insertColumnAfter(lastColumn);
      }
      
      // ヘッダーを設定
      sheet.getRange(headerRow, columnIndex).setValue(headerName);
      
      // キャッシュに保存
      const cacheKey = `${sheet.getSheetId()}_${headerName}_row${headerRow}`;
      SheetService.columnCache.set(cacheKey, columnIndex);
      
      console.log(`新しいカラム "${headerName}" を追加しました (Column: ${columnIndex})`);
      return columnIndex;
    } catch (error) {
      console.error(`カラム追加エラー (${headerName}):`, error);
      throw error;
    }
  }
  
  /**
   * 複数のヘッダー名からカラムインデックスを一括取得する
   * @param {Sheet} sheet - 対象のシート
   * @param {string[]} headerNames - 検索するヘッダー名の配列
   * @param {Object} options - オプション設定（getColumnIndexByHeaderと同じ）
   * @returns {Object} ヘッダー名をキー、カラムインデックスを値とするオブジェクト
   */
  static getMultipleColumnIndices(sheet, headerNames, options = {}) {
    const indices = {};
    
    for (const headerName of headerNames) {
      indices[headerName] = this.getColumnIndexByHeader(sheet, headerName, options);
    }
    
    return indices;
  }
  
  /**
   * キャッシュをクリアする
   * @param {string} sheetId - 特定のシートIDのキャッシュのみクリア（省略時は全てクリア）
   */
  static clearColumnCache(sheetId = null) {
    if (sheetId) {
      // 特定のシートのキャッシュのみクリア
      for (const [key, _] of SheetService.columnCache) {
        if (key.startsWith(sheetId)) {
          SheetService.columnCache.delete(key);
        }
      }
    } else {
      // 全てのキャッシュをクリア
      SheetService.columnCache.clear();
    }
  }
  
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
  
  static updateResponse(sheet, rowIndex, status, timestamp = null, draftId = null, aiResponse = null) {
    try {
      // 動的にカラムインデックスを取得（キャッシュ使用）
      const columnIndices = this.getMultipleColumnIndices(
        sheet,
        ['事務局対応', 'AI回答'],
        { headerRow: 2, createIfNotFound: true }
      );
      
      // ステータス列更新
      const statusColumnIndex = columnIndices['事務局対応'] || status.statusCol;
      if (statusColumnIndex) {
        const statusColumn = sheet.getRange(rowIndex, statusColumnIndex);
        statusColumn.setValue(status.value);
      }
      
      // AI回答列更新（統合形式）
      const responseColumnIndex = columnIndices['AI回答'] || status.responseCol;
      if (responseColumnIndex && (timestamp || draftId || aiResponse)) {
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
        
        const responseColumn = sheet.getRange(rowIndex, responseColumnIndex);
        responseColumn.setValue(combinedInfo);
      }
      
      return true;
    } catch (error) {
      console.error(`回答更新エラー (Row: ${rowIndex}):`, error);
      return false;
    }
  }
  
  static addHeaderIfNeeded(sheet, columnIndex, headerText) {
    try {
      const headerCell = sheet.getRange(2, columnIndex);
      if (!headerCell.getValue() || headerCell.getValue() !== headerText) {
        headerCell.setValue(headerText);
      }
    } catch (error) {
      console.error(`ヘッダー追加エラー (Column: ${columnIndex}):`, error);
    }
  }
  
  /**
   * 特定のヘッダー名のカラムインデックスを取得し、必要に応じてヘッダーを設定する
   * @param {Sheet} sheet - 対象のシート
   * @param {string} headerName - ヘッダー名
   * @param {Object} options - オプション設定
   * @returns {number|null} カラムインデックス（1ベース）
   */
  static ensureHeaderColumn(sheet, headerName, options = {}) {
    const columnIndex = this.getColumnIndexByHeader(sheet, headerName, options);
    if (columnIndex) {
      // ヘッダーが正しく設定されているか確認
      this.addHeaderIfNeeded(sheet, columnIndex, headerName);
    }
    return columnIndex;
  }
}