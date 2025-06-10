// Gmail ラベル自動回答システム
// メイン関数

// メイン処理関数
function processLabeledEmails() {
  try {
    console.log('Gmailラベル自動回答処理開始');
    const processedCount = LabelProcessor.process();
    console.log(`処理完了: ${processedCount}件`);
    return processedCount;
  } catch (error) {
    console.error('メイン処理エラー:', error);
    throw error;
  }
}

// テスト実行関数（1件のみ）
function testSingleEmail() {
  try {
    console.log('テスト実行開始');
    const processedCount = LabelProcessor.testSingleEmail();
    console.log(`テスト完了: ${processedCount}件処理`);
    return processedCount;
  } catch (error) {
    console.error('テスト実行エラー:', error);
    throw error;
  }
}

// 設定確認関数
function checkConfig() {
  try {
    console.log('=== 設定確認 ===');
    
    // OpenAI APIキー確認
    const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
    console.log('OpenAI APIキー:', apiKey ? 'セット済み' : '未設定');
    
    // Gmail権限確認
    try {
      const labels = Gmail.Users.Labels.list('me');
      console.log('Gmail権限:', 'OK');
      console.log('利用可能ラベル数:', labels.labels.length);
    } catch (error) {
      console.log('Gmail権限:', 'エラー -', error.message);
    }
    
    // ラベル存在確認
    console.log('=== ラベル確認 ===');
    console.log('処理対象ラベル:', GMAIL_CONFIG.SOURCE_LABEL);
    console.log('処理済みラベル:', GMAIL_CONFIG.TARGET_LABEL);
    
    console.log('設定確認完了');
  } catch (error) {
    console.error('設定確認エラー:', error);
  }
}

// トリガー設定
function setupTrigger() {
  // 既存のトリガーを削除
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'processLabeledEmails') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // 新しいトリガーを作成
  ScriptApp.newTrigger('processLabeledEmails')
    .timeBased()
    .everyHours(1)
    .create();
    
  console.log('トリガー設定完了：1時間ごとに実行されます');
}

// トリガー削除
function deleteTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'processLabeledEmails') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  console.log('すべてのトリガーを削除しました');
}