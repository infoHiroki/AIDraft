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

// 動的カラム機能テスト
function testDynamicColumns() {
  try {
    const config = SHEET_CONFIGS.WEEKEND_ENT;
    const sheet = SheetService.getSheet(config.SHEET_ID, config.SHEET_NAME);
    
    console.log('=== 動的カラム機能テスト開始 ===');
    
    // 既存のキャッシュをクリア
    SheetService.clearColumnCache();
    console.log('キャッシュクリア完了');
    
    // "事務局対応"と"AI回答"カラムのインデックスを取得
    const columnIndices = SheetService.getMultipleColumnIndices(
      sheet,
      ['事務局対応', 'AI回答'],
      { headerRow: 2, createIfNotFound: true }
    );
    
    console.log('取得したカラムインデックス:', columnIndices);
    
    // キャッシュ確認
    console.log('キャッシュサイズ:', SheetService.columnCache.size);
    
    // 再度同じカラムを取得（キャッシュから）
    const cachedIndices = SheetService.getMultipleColumnIndices(
      sheet,
      ['事務局対応', 'AI回答'],
      { headerRow: 2, createIfNotFound: false }
    );
    
    console.log('キャッシュから取得したカラムインデックス:', cachedIndices);
    
    // 単一カラム取得テスト
    const statusCol = SheetService.getColumnIndexByHeader(sheet, '事務局対応');
    const responseCol = SheetService.getColumnIndexByHeader(sheet, 'AI回答');
    
    console.log('単一取得結果 - 事務局対応:', statusCol, 'AI回答:', responseCol);
    
    console.log('=== 動的カラム機能テスト完了 ===');
    
    return {
      columnIndices,
      cachedIndices,
      statusCol,
      responseCol,
      cacheSize: SheetService.columnCache.size
    };
    
  } catch (error) {
    console.error('動的カラム機能テストエラー:', error);
    throw error;
  }
}