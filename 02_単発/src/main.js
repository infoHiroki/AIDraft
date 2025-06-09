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