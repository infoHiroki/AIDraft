// その他セミナーシート処理クラス
class OtherSeminarProcessor {
  
  static process() {
    return this._processRows(false);
  }
  
  static testSingleRow() {
    return this._processRows(true);
  }
  
  static _processRows(testMode = false) {
    const config = SHEET_CONFIGS.OTHER_SEMINAR;
    const sheet = SheetService.getSheet(config.SHEET_ID, config.SHEET_NAME);
    const aiColumnIndex = SheetService.getColumnIndexByHeader(sheet, 'AI回答', { headerRow: 1, createIfNotFound: true });
    const data = sheet.getDataRange().getValues();
    let processedCount = 0;
    
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
          
          this._updateSheet(sheet, i + 1, aiColumnIndex, COMMON_CONFIG.STATUS.TEST, draftId, draft.body);
          processedCount++;
          
        } catch (error) {
          console.error(`Row ${i + 1} エラー:`, error);
          this._updateSheet(sheet, i + 1, aiColumnIndex, COMMON_CONFIG.STATUS.ERROR, null, error.toString());
        }
      }
    }
    
    console.log(`その他セミナーシート${testMode ? 'テスト' : '処理'}完了: ${processedCount}件`);
    return processedCount;
  }
  
  static _updateSheet(sheet, rowIndex, aiColumnIndex, status, draftId, content) {
    const config = SHEET_CONFIGS.OTHER_SEMINAR;
    const timestamp = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm');
    
    sheet.getRange(rowIndex, config.COLUMNS.STATUS + 1).setValue(status);
    
    const info = draftId ? 
      `${timestamp}\nDraft ID: ${draftId}\n────────────────\n${content}` :
      `${timestamp}\n────────────────\nエラー: ${content}`;
    
    sheet.getRange(rowIndex, aiColumnIndex).setValue(info);
  }
}