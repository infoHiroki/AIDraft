/**
 * 統合プロセッサークラス（V2: 管理シートベース）
 * すべてのシートの処理を統一的に行う
 */
class UnifiedProcessor {
  
  /**
   * 指定されたシートタイプの処理を実行（管理シートベース）
   * @param {string} sheetType - シートタイプ（'WEEKEND', 'OTHER', 'INQUIRY'）
   * @returns {number} 処理件数
   */
  static async process(sheetType) {
    const config = getSheetConfig(sheetType);
    console.log(`${config.description}の処理を開始（管理シートベース）`);
    
    // 未処理レコードを取得
    const unprocessedRecords = ManagementService.getUnprocessedRecords(sheetType);
    
    if (unprocessedRecords.length === 0) {
      console.log(`${config.description}: 未処理データなし`);
      return 0;
    }
    
    console.log(`${config.description}: ${unprocessedRecords.length}件の未処理データを検出`);
    
    let processedCount = 0;
    const maxProcessing = Math.min(unprocessedRecords.length, COMMON_CONFIG.LIMITS.MAX_ROWS_PER_EXECUTION);
    
    for (let i = 0; i < maxProcessing; i++) {
      const record = unprocessedRecords[i];
      
      try {
        // 処理開始を記録
        ManagementService.createProcessingRecord(sheetType, record.timestamp);
        
        // データ抽出
        const extractedData = this.extractData(record.data, config, sheetType);
        
        // AI回答生成
        const aiResponse = await AIService.generateSeminarResponse(extractedData, sheetType);
        
        // Gmail下書き作成
        const draftId = await GmailService.createDraft(
          extractedData.email,
          `Re: ${config.subjectPrefix}についてのご質問`,
          aiResponse,
          config.labelName
        );
        
        // 処理完了を記録
        ManagementService.markAsCompleted(sheetType, record.timestamp);
        
        console.log(`${record.timestamp}: 下書き作成成功 (${config.description})`);
        processedCount++;
        
      } catch (error) {
        console.error(`${record.timestamp} エラー (${config.description}):`, error);
        ManagementService.markAsError(sheetType, record.timestamp, error.toString());
      }
    }
    
    console.log(`${config.description}処理完了: ${processedCount}件`);
    return processedCount;
  }
  
  /**
   * 1件のみテスト実行（管理シートベース）
   * @param {string} sheetType - シートタイプ
   * @returns {number} 処理件数（0または1）
   */
  static async testSingle(sheetType) {
    const config = getSheetConfig(sheetType);
    console.log(`${config.description}のテスト実行を開始（管理シートベース）`);
    
    // 未処理レコードを取得
    const unprocessedRecords = ManagementService.getUnprocessedRecords(sheetType);
    
    if (unprocessedRecords.length === 0) {
      console.log(`${config.description}: テスト対象データなし`);
      return 0;
    }
    
    // 最初の未処理レコードでテスト実行
    const record = unprocessedRecords[0];
    console.log(`テスト実行: ${record.timestamp} (${config.description})`);
    
    try {
      // データ抽出
      const extractedData = this.extractData(record.data, config, sheetType);
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
      
      // テスト実行として管理シートに記録
      const managementSheet = getManagementSheet();
      managementSheet.appendRow([
        sheetType,          // A列: 種別
        record.timestamp,   // B列: タイムスタンプ
        'テスト実行'        // C列: 処理ステータス
      ]);
      
      console.log(`テスト完了: Gmail下書き作成 (${draftId})`);
      return 1;
      
    } catch (error) {
      console.error(`テストエラー ${record.timestamp} (${config.description}):`, error);
      
      // エラーとして管理シートに記録
      const managementSheet = getManagementSheet();
      managementSheet.appendRow([
        sheetType,          // A列: 種別
        record.timestamp,   // B列: タイムスタンプ
        'テストエラー'      // C列: 処理ステータス
      ]);
      
      return 0;
    }
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