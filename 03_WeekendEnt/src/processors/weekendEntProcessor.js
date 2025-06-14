// WeekendEntシート処理クラス
class WeekendEntProcessor {
  
  static process() {
    const config = SHEET_CONFIGS.WEEKEND_ENT;
    const sheet = SheetService.getSheet(config.SHEET_ID, config.SHEET_NAME);
    
    // 動的にカラムインデックスを取得し、必要に応じてヘッダーを追加
    const columnIndices = SheetService.getMultipleColumnIndices(
      sheet,
      ['事務局対応', 'AI回答'],
      { headerRow: 2, createIfNotFound: true }
    );
    
    const data = sheet.getDataRange().getValues();
    let processedCount = 0;
    
    for (let i = 2; i < data.length && processedCount < config.MAX_ROWS_PER_RUN; i++) {
      const row = data[i];
      
      // G列（質問）があり、動的に取得した事務局対応列が空なら未処理
      const statusColumnIndex = columnIndices['事務局対応'] - 1; // 0ベースに変換
      if (row[config.COLUMNS.QUESTION] && 
          row[config.COLUMNS.QUESTION].trim() !== '' &&
          (!row[statusColumnIndex] || row[statusColumnIndex] === '')) {
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
          
          // ステータス更新（動的カラムインデックス使用）
          SheetService.updateResponse(
            sheet, 
            i + 1, 
            {
              statusCol: columnIndices['事務局対応'] || config.COLUMNS.STATUS + 1,
              responseCol: columnIndices['AI回答'] || config.COLUMNS.AI_RESPONSE + 1,
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
              statusCol: columnIndices['事務局対応'] || config.COLUMNS.STATUS + 1,
              responseCol: columnIndices['AI回答'] || config.COLUMNS.AI_RESPONSE + 1,
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
    
    // 動的にカラムインデックスを取得し、必要に応じてヘッダーを追加
    const columnIndices = SheetService.getMultipleColumnIndices(
      sheet,
      ['事務局対応', 'AI回答'],
      { headerRow: 2, createIfNotFound: true }
    );
    
    const data = sheet.getDataRange().getValues();
    let processedCount = 0;
    
    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      
      // 動的に取得したステータス列をチェック
      const statusColumnIndex = columnIndices['事務局対応'] - 1; // 0ベースに変換
      if (row[config.COLUMNS.QUESTION] && 
          row[config.COLUMNS.QUESTION].trim() !== '' &&
          (!row[statusColumnIndex] || row[statusColumnIndex] === '')) {
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
          
          // テスト実行として記録（動的カラムインデックス使用）
          SheetService.updateResponse(
            sheet, 
            i + 1, 
            {
              statusCol: columnIndices['事務局対応'] || config.COLUMNS.STATUS + 1,
              responseCol: columnIndices['AI回答'] || config.COLUMNS.AI_RESPONSE + 1,
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
              statusCol: columnIndices['事務局対応'] || config.COLUMNS.STATUS + 1,
              responseCol: columnIndices['AI回答'] || config.COLUMNS.AI_RESPONSE + 1,
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