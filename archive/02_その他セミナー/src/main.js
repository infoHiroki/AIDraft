// メイン処理ファイル

// その他セミナーシート自動処理（定期実行用）
function processOtherSeminar() {
  try {
    return OtherSeminarProcessor.process();
  } catch (error) {
    console.error('その他セミナーシート処理エラー:', error);
    throw error;
  }
}

// その他セミナーシートテスト実行
function testOtherSeminarSingleRow() {
  try {
    return OtherSeminarProcessor.testSingleRow();
  } catch (error) {
    console.error('その他セミナーシートテスト実行エラー:', error);
    throw error;
  }
}

// トリガー設定
function setupTrigger() {
  // 既存のトリガーを削除
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'processOtherSeminar') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // 新しいトリガーを作成
  ScriptApp.newTrigger('processOtherSeminar')
    .timeBased()
    .everyHours(1)
    .create();
    
  console.log('トリガー設定完了：1時間ごとに実行されます');
}

// トリガー削除
function deleteTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'processOtherSeminar') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  console.log('トリガー削除完了');
}

// 設定確認
function checkConfig() {
  const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  console.log('API Key設定:', apiKey ? '設定済み' : '未設定');
  
  // その他セミナーシート接続確認
  const config = SHEET_CONFIGS.OTHER_SEMINAR;
  console.log('その他セミナーシート設定:', config);
  
  try {
    const sheet = SheetService.getSheet(config.SHEET_ID, config.SHEET_NAME);
    console.log('その他セミナーシート接続:', sheet ? '成功' : '失敗');
  } catch (error) {
    console.log('その他セミナーシート接続エラー:', error.toString());
  }
}