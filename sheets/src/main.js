/**
 * AIDraft Sheets - 統合メインエントリーポイント
 * 3つのシート（WeekendDent、その他セミナー、お問い合わせ）を処理
 */

// ===================
// メイン処理関数
// ===================

/**
 * WeekendDentシートの処理
 * F列の質問をもとにAI回答を生成し、G列にステータス、H列に回答を出力
 */
function processWeekendDent() {
  console.log('=== WeekendDent処理開始 ===');
  try {
    const count = UnifiedProcessor.process('WEEKEND');
    console.log(`WeekendDent処理完了: ${count}件`);
    return count;
  } catch (error) {
    console.error('WeekendDent処理エラー:', error);
    throw error;
  }
}

/**
 * その他セミナーシートの処理
 * F列の質問をもとにAI回答を生成し、G列にステータス、H列に回答を出力
 */
function processOtherSeminar() {
  console.log('=== その他セミナー処理開始 ===');
  try {
    const count = UnifiedProcessor.process('OTHER');
    console.log(`その他セミナー処理完了: ${count}件`);
    return count;
  } catch (error) {
    console.error('その他セミナー処理エラー:', error);
    throw error;
  }
}

/**
 * お問い合わせシートの処理
 * F列の質問をもとにAI回答を生成し、H列にステータス、I列に回答を出力
 */
function processInquiry() {
  console.log('=== お問い合わせ処理開始 ===');
  try {
    const count = UnifiedProcessor.process('INQUIRY');
    console.log(`お問い合わせ処理完了: ${count}件`);
    return count;
  } catch (error) {
    console.error('お問い合わせ処理エラー:', error);
    throw error;
  }
}

// ===================
// テスト関数
// ===================

/**
 * WeekendDentの1件テスト
 */
function testWeekendDent() {
  console.log('=== WeekendDentテスト開始 ===');
  try {
    const count = UnifiedProcessor.testSingle('WEEKEND');
    console.log(`WeekendDentテスト完了: ${count}件`);
    return count;
  } catch (error) {
    console.error('WeekendDentテストエラー:', error);
    throw error;
  }
}

/**
 * その他セミナーの1件テスト
 */
function testOtherSeminar() {
  console.log('=== その他セミナーテスト開始 ===');
  try {
    const count = UnifiedProcessor.testSingle('OTHER');
    console.log(`その他セミナーテスト完了: ${count}件`);
    return count;
  } catch (error) {
    console.error('その他セミナーテストエラー:', error);
    throw error;
  }
}

/**
 * お問い合わせの1件テスト
 */
function testInquiry() {
  console.log('=== お問い合わせテスト開始 ===');
  try {
    const count = UnifiedProcessor.testSingle('INQUIRY');
    console.log(`お問い合わせテスト完了: ${count}件`);
    return count;
  } catch (error) {
    console.error('お問い合わせテストエラー:', error);
    throw error;
  }
}

// ===================
// 設定・管理関数
// ===================

/**
 * 全シートの設定確認
 */
function checkConfig() {
  console.log('=== 設定確認開始 ===');
  
  try {
    // OpenAI APIキー確認
    const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
    console.log('OpenAI APIキー:', apiKey ? '設定済み' : '未設定');
    
    // Gmail設定確認
    const gmailResult = GmailService.checkGmailAccess();
    console.log('Gmail設定:', gmailResult);
    
    // シート設定確認
    const sheetResults = SheetService.checkAllConfigs();
    console.log('シート設定:', sheetResults);
    
    console.log('=== 設定確認完了 ===');
    return {
      apiKey: !!apiKey,
      gmail: gmailResult,
      sheets: sheetResults
    };
    
  } catch (error) {
    console.error('設定確認エラー:', error);
    throw error;
  }
}

/**
 * 全シート用のトリガーを設定
 * 各処理を1時間ごとに実行
 */
function setupTriggers() {
  console.log('=== トリガー設定開始 ===');
  
  try {
    // 既存のトリガーを削除
    deleteTriggers();
    
    // 新しいトリガーを作成（1時間ごと）
    ScriptApp.newTrigger('processWeekendDent')
      .timeBased()
      .everyHours(1)
      .create();
      
    ScriptApp.newTrigger('processOtherSeminar')
      .timeBased()
      .everyHours(1)
      .create();
      
    ScriptApp.newTrigger('processInquiry')
      .timeBased()
      .everyHours(1)
      .create();
    
    console.log('トリガー設定完了: 3つの処理を1時間ごとに実行');
    
  } catch (error) {
    console.error('トリガー設定エラー:', error);
    throw error;
  }
}

/**
 * 全トリガーを削除
 */
function deleteTriggers() {
  console.log('=== トリガー削除開始 ===');
  
  try {
    const triggers = ScriptApp.getProjectTriggers();
    let deleteCount = 0;
    
    for (const trigger of triggers) {
      const functionName = trigger.getHandlerFunction();
      if (['processWeekendDent', 'processOtherSeminar', 'processInquiry'].includes(functionName)) {
        ScriptApp.deleteTrigger(trigger);
        deleteCount++;
      }
    }
    
    console.log(`トリガー削除完了: ${deleteCount}個`);
    
  } catch (error) {
    console.error('トリガー削除エラー:', error);
    throw error;
  }
}

// ===================
// 統合実行関数
// ===================

/**
 * 全シートの処理を順次実行
 * ※通常は個別の関数を使用することを推奨
 */
function processAllSheets() {
  console.log('=== 全シート処理開始 ===');
  
  const results = {
    weekend: 0,
    other: 0,
    inquiry: 0,
    errors: []
  };
  
  try {
    results.weekend = processWeekendDent();
  } catch (error) {
    results.errors.push(`WeekendDent: ${error.message}`);
  }
  
  try {
    results.other = processOtherSeminar();
  } catch (error) {
    results.errors.push(`その他セミナー: ${error.message}`);
  }
  
  try {
    results.inquiry = processInquiry();
  } catch (error) {
    results.errors.push(`お問い合わせ: ${error.message}`);
  }
  
  console.log('=== 全シート処理完了 ===', results);
  return results;
}