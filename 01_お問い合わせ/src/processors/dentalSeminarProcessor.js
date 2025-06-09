// 歯科セミナー処理クラス
class DentalSeminarProcessor {
  
  static process() {
    const config = SHEET_CONFIGS.DENTAL_SEMINAR;
    const sheet = SheetService.getSheet(config.SHEET_ID, config.SHEET_NAME);
    
    // ヘッダー追加（初回のみ）
    SheetService.addHeaderIfNeeded(sheet, 8, '処理詳細');
    
    const data = sheet.getDataRange().getValues();
    let processedCount = 0;
    
    for (let i = 1; i < data.length && processedCount < config.MAX_ROWS_PER_RUN; i++) {
      const row = data[i];
      
      // G列（事務局対応）が空なら未処理
      if (!row[config.COLUMNS.STATUS] || row[config.COLUMNS.STATUS] === '') {
        try {
          const inquiryInfo = {
            email: row[config.COLUMNS.EMAIL],
            clinicName: row[config.COLUMNS.CLINIC_NAME],
            doctorName: row[config.COLUMNS.DOCTOR_NAME],
            seminarName: row[config.COLUMNS.SEMINAR_NAME],
            question: row[config.COLUMNS.QUESTION]
          };
          
          const draft = AIService.generateDentalSeminarDraft(inquiryInfo);
          const draftId = GmailService.createDraft(
            inquiryInfo.email, 
            draft.subject, 
            draft.body,
            config.LABEL_NAME
          );
          
          // ステータス更新
          SheetService.updateStatus(
            sheet, 
            i + 1, 
            COMMON_CONFIG.STATUS.COMPLETED,
            new Date(),
            draftId,
            draft.body
          );
          
          console.log(`Row ${i + 1}: 下書き作成成功`);
          processedCount++;
          
        } catch (error) {
          console.error(`Row ${i + 1} エラー:`, error);
          SheetService.updateStatus(
            sheet, 
            i + 1, 
            COMMON_CONFIG.STATUS.ERROR,
            new Date(),
            null,
            error.toString()
          );
        }
      }
    }
    
    console.log(`処理完了: ${processedCount}件`);
    return processedCount;
  }
  
  static testSingleRow() {
    const config = SHEET_CONFIGS.DENTAL_SEMINAR;
    const sheet = SheetService.getSheet(config.SHEET_ID, config.SHEET_NAME);
    
    // ヘッダー追加
    SheetService.addHeaderIfNeeded(sheet, 8, '処理詳細');
    
    const data = sheet.getDataRange().getValues();
    let processedCount = 0;
    
    for (let i = 1; i < data.length; i++) {
      if (!data[i][config.COLUMNS.STATUS] || data[i][config.COLUMNS.STATUS] === '') {
        console.log(`テスト実行: Row ${i + 1}`);
        
        const row = data[i];
        try {
          const inquiryInfo = {
            email: row[config.COLUMNS.EMAIL],
            clinicName: row[config.COLUMNS.CLINIC_NAME],
            doctorName: row[config.COLUMNS.DOCTOR_NAME],
            seminarName: row[config.COLUMNS.SEMINAR_NAME],
            question: row[config.COLUMNS.QUESTION]
          };
          
          const draft = AIService.generateDentalSeminarDraft(inquiryInfo);
          console.log('生成された返信:', draft);
          
          const draftId = GmailService.createDraft(
            inquiryInfo.email, 
            draft.subject, 
            draft.body,
            config.LABEL_NAME
          );
          
          // テスト実行として記録
          SheetService.updateStatus(
            sheet, 
            i + 1, 
            COMMON_CONFIG.STATUS.TEST,
            new Date(),
            draftId,
            draft.body
          );
          
          console.log('Gmail下書き作成完了:', draftId);
          processedCount++;
          
        } catch (error) {
          console.error(`テストエラー Row ${i + 1}:`, error);
          SheetService.updateStatus(
            sheet, 
            i + 1, 
            COMMON_CONFIG.STATUS.ERROR,
            new Date(),
            null,
            'エラー: ' + error.toString()
          );
        }
        break; // テストは1件のみ
      }
    }
    
    console.log(`テスト完了: ${processedCount}件処理`);
    return processedCount;
  }
}