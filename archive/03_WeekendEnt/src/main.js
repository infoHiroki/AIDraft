// メイン処理ファイル

// WeekendEntシート自動処理（定期実行用）
function processWeekendEnt() {
  try {
    return WeekendEntProcessor.process();
  } catch (error) {
    console.error('WeekendEntシート処理エラー:', error);
    throw error;
  }
}

// WeekendEntシートテスト実行
function testWeekendEntSingleRow() {
  try {
    return WeekendEntProcessor.testSingleRow();
  } catch (error) {
    console.error('WeekendEntシートテスト実行エラー:', error);
    throw error;
  }
}

// トリガー設定
function setupTrigger() {
  // 既存のトリガーを削除
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'processWeekendEnt') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // 新しいトリガーを作成
  ScriptApp.newTrigger('processWeekendEnt')
    .timeBased()
    .everyHours(1)
    .create();
    
  console.log('トリガー設定完了：1時間ごとに実行されます');
}

// トリガー削除
function deleteTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'processWeekendEnt') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  console.log('トリガー削除完了');
}

// 設定確認
function checkConfig() {
  const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  console.log('API Key設定:', apiKey ? '設定済み' : '未設定');
  
  // WeekendEntシート接続確認
  const weekendConfig = SHEET_CONFIGS.WEEKEND_ENT;
  console.log('WeekendEntシート設定:', weekendConfig);
  
  try {
    const weekendSheet = SheetService.getSheet(weekendConfig.SHEET_ID, weekendConfig.SHEET_NAME);
    console.log('WeekendEntシート接続:', weekendSheet ? '成功' : '失敗');
  } catch (error) {
    console.log('WeekendEntシート接続エラー:', error.toString());
  }
}

