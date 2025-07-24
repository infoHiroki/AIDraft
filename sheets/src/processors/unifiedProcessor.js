/**
 * 統合プロセッサークラス
 * すべてのシートの処理を統一的に行う
 */
class UnifiedProcessor {
  
  /**
   * 指定されたシートタイプの処理を実行
   * @param {string} sheetType - シートタイプ（'WEEKEND', 'OTHER', 'INQUIRY'）
   * @returns {number} 処理件数
   */
  static async process(sheetType) {
    const config = getSheetConfig(sheetType);
    const sheet = SheetService.getSheet(SHEET_CONFIG.SPREADSHEET_ID, config.sheetName);
    
    console.log(`${config.description}の処理を開始`);
    
    const data = sheet.getDataRange().getValues();
    let processedCount = 0;
    
    for (let i = 1; i < data.length && processedCount < COMMON_CONFIG.LIMITS.MAX_ROWS_PER_EXECUTION; i++) {
      const row = data[i];
      
      // 質問列にデータがあり、ステータス列が空なら未処理
      const questionIndex = this.getColumnIndex(config.questionColumn);
      const statusIndex = this.getColumnIndex(config.statusColumn);
      
      if (row[questionIndex] && row[questionIndex].toString().trim() !== '' && 
          (!row[statusIndex] || row[statusIndex] === '')) {
        try {
          // データ抽出
          const extractedData = this.extractData(row, config, sheetType);
          
          // AI回答生成
          const aiResponse = await AIService.generateSeminarResponse(extractedData, sheetType);
          
          // Gmail下書き作成
          const draftId = await GmailService.createDraft(
            extractedData.email,
            `Re: ${config.subjectPrefix}についてのご質問`,
            aiResponse,
            config.labelName
          );
          
          // ステータス更新
          this.updateStatus(sheet, i + 1, config, draftId, aiResponse, COMMON_CONFIG.STATUS.COMPLETED);
          
          console.log(`Row ${i + 1}: 下書き作成成功 (${config.description})`);
          processedCount++;
          
        } catch (error) {
          console.error(`Row ${i + 1} エラー (${config.description}):`, error);
          this.updateStatus(sheet, i + 1, config, null, error.toString(), COMMON_CONFIG.STATUS.ERROR);
        }
      }
    }
    
    console.log(`${config.description}処理完了: ${processedCount}件`);
    return processedCount;
  }
  
  /**
   * 1件のみテスト実行
   * @param {string} sheetType - シートタイプ
   * @returns {number} 処理件数（0または1）
   */
  static async testSingle(sheetType) {
    const config = getSheetConfig(sheetType);
    const sheet = SheetService.getSheet(SHEET_CONFIG.SPREADSHEET_ID, config.sheetName);
    
    console.log(`${config.description}のテスト実行を開始`);
    
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const questionIndex = this.getColumnIndex(config.questionColumn);
      const statusIndex = this.getColumnIndex(config.statusColumn);
      
      if (row[questionIndex] && row[questionIndex].toString().trim() !== '' && 
          (!row[statusIndex] || row[statusIndex] === '')) {
        
        console.log(`テスト実行: Row ${i + 1} (${config.description})`);
        
        try {
          // データ抽出
          const extractedData = this.extractData(row, config, sheetType);
          console.log('抽出データ:', extractedData);
          
          // AI回答生成
          const aiResponse = await AIService.generateSeminarResponse(extractedData, sheetType);
          console.log('AI回答:', aiResponse);
          
          // Gmail下書き作成
          const draftId = await GmailService.createDraft(
            extractedData.email,
            `Re: ${config.subjectPrefix}についてのご質問`,
            aiResponse,
            config.labelName
          );
          
          // テスト実行として記録
          this.updateStatus(sheet, i + 1, config, draftId, aiResponse, COMMON_CONFIG.STATUS.TEST);
          
          console.log(`テスト完了: Gmail下書き作成 (${draftId})`);
          return 1;
          
        } catch (error) {
          console.error(`テストエラー Row ${i + 1} (${config.description}):`, error);
          this.updateStatus(sheet, i + 1, config, null, 'テストエラー: ' + error.toString(), COMMON_CONFIG.STATUS.ERROR);
          return 0;
        }
      }
    }
    
    console.log(`${config.description}: テスト対象データなし`);
    return 0;
  }
  
  /**
   * 行からデータを抽出
   * @param {Array} row - スプレッドシートの行データ
   * @param {Object} config - シート設定
   * @param {string} sheetType - シートタイプ
   * @returns {Object} 抽出されたデータ
   */
  static extractData(row, config, sheetType) {
    const data = {
      question: row[this.getColumnIndex(config.questionColumn)] || ''
    };
    
    // シートタイプ別の固有データ抽出
    switch (sheetType) {
      case 'WEEKEND':
        data.email = row[this.getColumnIndex(config.columns.email)] || '';
        data.doctorName = row[this.getColumnIndex(config.columns.doctorName)] || '';
        data.clinicName = row[this.getColumnIndex(config.columns.clinicName)] || '';
        data.impression = row[this.getColumnIndex(config.columns.impression)] || '';
        break;
        
      case 'OTHER':
        data.email = row[this.getColumnIndex(config.columns.email)] || '';
        data.doctorName = row[this.getColumnIndex(config.columns.doctorName)] || '';
        data.clinicName = row[this.getColumnIndex(config.columns.clinicName)] || '';
        data.summary = row[this.getColumnIndex(config.columns.summary)] || '';
        break;
        
      case 'INQUIRY':
        data.email = row[this.getColumnIndex(config.columns.email)] || '';
        data.doctorName = row[this.getColumnIndex(config.columns.doctorName)] || '';
        data.clinicName = row[this.getColumnIndex(config.columns.clinicName)] || '';
        data.summary = row[this.getColumnIndex(config.columns.summary)] || '';
        break;
    }
    
    return data;
  }
  
  /**
   * ステータス更新
   * @param {Sheet} sheet - スプレッドシート
   * @param {number} rowNumber - 行番号（1から開始）
   * @param {Object} config - シート設定
   * @param {string} draftId - Gmail下書きID
   * @param {string} content - AI回答またはエラー内容
   * @param {string} status - ステータス
   */
  static updateStatus(sheet, rowNumber, config, draftId, content, status) {
    // ステータス列にステータスのみ記録（約束通りI列は使わない）
    const statusColumn = config.statusColumn;
    sheet.getRange(statusColumn + rowNumber).setValue(status);
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