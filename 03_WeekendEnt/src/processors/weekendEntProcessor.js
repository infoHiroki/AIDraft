// WeekendEntシート処理クラス
class WeekendEntProcessor {
  
  static process() {
    const config = SHEET_CONFIGS.WEEKEND_ENT;
    const sheet = SheetService.getSheet(config.SHEET_ID, config.SHEET_NAME);
    
    // ヘッダー追加（初回のみ）
    SheetService.addHeaderIfNeeded(sheet, config.COLUMNS.AI_RESPONSE + 1, 'AI回答');
    
    const data = sheet.getDataRange().getValues();
    let processedCount = 0;
    
    for (let i = 1; i < data.length && processedCount < config.MAX_ROWS_PER_RUN; i++) {
      const row = data[i];
      
      // G列（質問）があり、H列（事務局対応）が空なら未処理
      if (row[config.COLUMNS.QUESTION] && 
          row[config.COLUMNS.QUESTION].trim() !== '' &&
          (!row[config.COLUMNS.STATUS] || row[config.COLUMNS.STATUS] === '')) {
        try {
          const questionInfo = {
            email: row[config.COLUMNS.EMAIL] || '',
            clinicName: row[config.COLUMNS.CLINIC_NAME] || '',
            doctorName: row[config.COLUMNS.DOCTOR_NAME] || '',
            impression: row[config.COLUMNS.IMPRESSION] || '',
            question: row[config.COLUMNS.QUESTION]
          };
          
          const draft = AIService.generateSeminarQuestionResponse(questionInfo);
          const draftId = GmailService.createDraft(
            questionInfo.email, 
            draft.subject, 
            draft.body,
            config.LABEL_NAME
          );
          
          // ステータス更新
          SheetService.updateResponse(
            sheet, 
            i + 1, 
            {
              statusCol: config.COLUMNS.STATUS + 1,
              responseCol: config.COLUMNS.AI_RESPONSE + 1,
              value: COMMON_CONFIG.STATUS.COMPLETED
            },
            new Date(),
            draftId,
            draft.body
          );
          
          console.log(`Row ${i + 1}: AI回答作成成功`);
          processedCount++;
          
        } catch (error) {
          console.error(`Row ${i + 1} エラー:`, error);
          SheetService.updateResponse(
            sheet, 
            i + 1, 
            {
              statusCol: config.COLUMNS.STATUS + 1,
              responseCol: config.COLUMNS.AI_RESPONSE + 1,
              value: COMMON_CONFIG.STATUS.ERROR
            },
            new Date(),
            null,
            error.toString()
          );
        }
      }
    }
    
    console.log(`WeekendEntシート処理完了: ${processedCount}件`);
    return processedCount;
  }
  
  static testSingleRow() {
    const config = SHEET_CONFIGS.WEEKEND_ENT;
    const sheet = SheetService.getSheet(config.SHEET_ID, config.SHEET_NAME);
    
    // ヘッダー追加
    SheetService.addHeaderIfNeeded(sheet, config.COLUMNS.AI_RESPONSE + 1, 'AI回答');
    
    const data = sheet.getDataRange().getValues();
    let processedCount = 0;
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      if (row[config.COLUMNS.QUESTION] && 
          row[config.COLUMNS.QUESTION].trim() !== '' &&
          (!row[config.COLUMNS.STATUS] || row[config.COLUMNS.STATUS] === '')) {
        console.log(`テスト実行: Row ${i + 1}`);
        
        try {
          const questionInfo = {
            email: row[config.COLUMNS.EMAIL] || '',
            clinicName: row[config.COLUMNS.CLINIC_NAME] || '',
            doctorName: row[config.COLUMNS.DOCTOR_NAME] || '',
            impression: row[config.COLUMNS.IMPRESSION] || '',
            question: row[config.COLUMNS.QUESTION]
          };
          
          const draft = AIService.generateSeminarQuestionResponse(questionInfo);
          console.log('生成された返信:', draft);
          
          const draftId = GmailService.createDraft(
            questionInfo.email, 
            draft.subject, 
            draft.body,
            config.LABEL_NAME
          );
          
          // テスト実行として記録
          SheetService.updateResponse(
            sheet, 
            i + 1, 
            {
              statusCol: config.COLUMNS.STATUS + 1,
              responseCol: config.COLUMNS.AI_RESPONSE + 1,
              value: COMMON_CONFIG.STATUS.TEST
            },
            new Date(),
            draftId,
            draft.body
          );
          
          console.log('AI回答作成完了');
          processedCount++;
          
        } catch (error) {
          console.error(`テストエラー Row ${i + 1}:`, error);
          SheetService.updateResponse(
            sheet, 
            i + 1, 
            {
              statusCol: config.COLUMNS.STATUS + 1,
              responseCol: config.COLUMNS.AI_RESPONSE + 1,
              value: COMMON_CONFIG.STATUS.ERROR
            },
            new Date(),
            null,
            'エラー: ' + error.toString()
          );
        }
        break; // テストは1件のみ
      }
    }
    
    console.log(`WeekendEntシートテスト完了: ${processedCount}件処理`);
    return processedCount;
  }
}