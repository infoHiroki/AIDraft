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

// WeekendEntシート処理（後で追加）
function processWeekendEnt() {
  try {
    // WeekendEntProcessor.process();
    console.log('WeekendEntシート処理: 未実装');
    return 0;
  } catch (error) {
    console.error('WeekendEntシート処理エラー:', error);
    throw error;
  }
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