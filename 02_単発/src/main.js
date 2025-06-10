// メイン処理ファイル

// 単発シート自動処理（定期実行用）
function processTanbatsu() {
  try {
    return TanbatsuProcessor.process();
  } catch (error) {
    console.error('単発シート処理エラー:', error);
    throw error;
  }
}

// 単発シートテスト実行
function testTanbatsuSingleRow() {
  try {
    return TanbatsuProcessor.testSingleRow();
  } catch (error) {
    console.error('単発シートテスト実行エラー:', error);
    throw error;
  }
}


// トリガー設定
function setupTrigger() {
  // 既存のトリガーを削除
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'processTanbatsu') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // 新しいトリガーを作成
  ScriptApp.newTrigger('processTanbatsu')
    .timeBased()
    .everyHours(1)
    .create();
    
  console.log('トリガー設定完了：1時間ごとに実行されます');
}

// トリガー削除
function deleteTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'processTanbatsu') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  console.log('トリガー削除完了');
}

// 設定確認
function checkConfig() {
  const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  console.log('API Key設定:', apiKey ? '設定済み' : '未設定');
  
  // 単発シート接続確認
  const tanbatsuConfig = SHEET_CONFIGS.TANBATSU;
  console.log('単発シート設定:', tanbatsuConfig);
  
  try {
    const tanbatsuSheet = SheetService.getSheet(tanbatsuConfig.SHEET_ID, tanbatsuConfig.SHEET_NAME);
    console.log('単発シート接続:', tanbatsuSheet ? '成功' : '失敗');
  } catch (error) {
    console.log('単発シート接続エラー:', error.toString());
  }
}