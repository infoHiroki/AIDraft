// WeekendEntシート処理クラス
class WeekendEntProcessor {
  
  static process() {
    return this._processRows(false);
  }
  
  static testSingleRow() {
    return this._processRows(true);
  }
  
  static _processRows(testMode = false) {
    const config = SHEET_CONFIGS.WEEKEND_ENT;
    const sheet = SheetService.getSheet(config.SHEET_ID, config.SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    let processedCount = 0;
    
    console.log(`処理開始: ${testMode ? 'テストモード' : '本番モード'}, データ行数: ${data.length}`);
    
    for (let i = 1; i < data.length && processedCount < (testMode ? 1 : config.MAX_ROWS_PER_RUN); i++) {
      const row = data[i];
      
      if (row[config.COLUMNS.QUESTION]?.trim() && !row[config.COLUMNS.STATUS]) {
        try {
          const questionInfo = {
            email: row[config.COLUMNS.EMAIL] || '',
            clinicName: row[config.COLUMNS.CLINIC_NAME] || '',
            doctorName: row[config.COLUMNS.DOCTOR_NAME] || '',
            impression: row[config.COLUMNS.IMPRESSION] || '',
            question: row[config.COLUMNS.QUESTION]
          };
          
          const draft = AIService.generateSeminarQuestionResponse(questionInfo);
          const draftId = GmailService.createDraft(questionInfo.email, draft.subject, draft.body, config.LABEL_NAME);
          
          this._updateSheet(sheet, i + 1, COMMON_CONFIG.STATUS.TEST, draftId);
          console.log(`処理成功: Row ${i + 1} (${questionInfo.email})`);
          processedCount++;
          
        } catch (error) {
          console.error(`Row ${i + 1} エラー:`, error);
          this._updateSheet(sheet, i + 1, COMMON_CONFIG.STATUS.ERROR);
        }
      }
    }
    
    console.log(`WeekendEntシート${testMode ? 'テスト' : '処理'}完了: ${processedCount}件`);
    return processedCount;
  }
  
  static _updateSheet(sheet, rowIndex, status, draftId = null) {
    const config = SHEET_CONFIGS.WEEKEND_ENT;
    const timestamp = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm');
    
    let value = status;
    if (draftId) {
      value = `${status} - ${timestamp} (Draft: ${draftId})`;
    } else if (status === COMMON_CONFIG.STATUS.ERROR) {
      value = `${status} - ${timestamp}`;
    }
    
    sheet.getRange(rowIndex, config.COLUMNS.STATUS + 1).setValue(value);
  }
}