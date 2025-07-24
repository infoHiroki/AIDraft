// メイン処理ファイル

// 歯科セミナー自動処理（定期実行用）
function processInquiries() {
  try {
    return DentalSeminarProcessor.process();
  } catch (error) {
    console.error('メイン処理エラー:', error);
    throw error;
  }
}

// 歯科セミナーテスト実行
function testSingleRow() {
  try {
    return DentalSeminarProcessor.testSingleRow();
  } catch (error) {
    console.error('テスト実行エラー:', error);
    throw error;
  }
}

// トリガー設定
function setupTrigger() {
  // 既存のトリガーを削除
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'processInquiries') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // 新しいトリガーを作成
  ScriptApp.newTrigger('processInquiries')
    .timeBased()
    .everyHours(1)
    .create();
    
  console.log('トリガー設定完了：1時間ごとに実行されます');
}

// トリガー削除
function deleteTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'processInquiries') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  console.log('トリガー削除完了');
}

// 設定確認
function checkConfig() {
  const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  console.log('API Key設定:', apiKey ? '設定済み' : '未設定');
  
  const config = SHEET_CONFIGS.DENTAL_SEMINAR;
  console.log('シート設定:', config);
  
  try {
    const sheet = SheetService.getSheet(config.SHEET_ID, config.SHEET_NAME);
    console.log('シート接続:', sheet ? '成功' : '失敗');
  } catch (error) {
    console.log('シート接続エラー:', error.toString());
  }
}