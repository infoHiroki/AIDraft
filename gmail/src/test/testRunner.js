// テスト実行用メイン関数

// 全テスト実行
function runAllTests() {
  console.log('=== Gmail未読処理 テスト開始 ===');
  
  const testFramework = new TestFramework();
  
  // 単体テストを追加
  UnitTests.setupTests(testFramework);
  
  // 統合テストを追加
  IntegrationTests.setupTests(testFramework);
  
  // 全テスト実行
  const results = testFramework.runAllTests();
  
  console.log('\n=== テスト完了 ===');
  return results;
}

// 単体テストのみ実行
function runUnitTests() {
  console.log('=== 単体テスト実行 ===');
  
  const testFramework = new TestFramework();
  UnitTests.setupTests(testFramework);
  
  const results = testFramework.runAllTests();
  console.log('\n=== 単体テスト完了 ===');
  return results;
}

// 統合テストのみ実行
function runIntegrationTests() {
  console.log('=== 統合テスト実行 ===');
  
  const testFramework = new TestFramework();
  IntegrationTests.setupTests(testFramework);
  
  const results = testFramework.runAllTests();
  console.log('\n=== 統合テスト完了 ===');
  return results;
}

// 特定のテストを実行
function runSpecificTest(testName) {
  console.log(`=== 特定テスト実行: ${testName} ===`);
  
  const testFramework = new TestFramework();
  UnitTests.setupTests(testFramework);
  IntegrationTests.setupTests(testFramework);
  
  const result = testFramework.runTest(testName);
  console.log('\n=== 特定テスト完了 ===');
  return result;
}

// テスト環境確認
function checkTestEnvironment() {
  console.log('=== テスト環境確認 ===');
  
  const checks = [];
  
  // 必要なクラスの存在確認
  checks.push({
    name: 'TestFramework',
    exists: typeof TestFramework !== 'undefined'
  });
  checks.push({
    name: 'MockData',
    exists: typeof MockData !== 'undefined'
  });
  checks.push({
    name: 'UnitTests',
    exists: typeof UnitTests !== 'undefined'
  });
  checks.push({
    name: 'IntegrationTests',
    exists: typeof IntegrationTests !== 'undefined'
  });
  
  // 設定ファイルの存在確認
  checks.push({
    name: 'GMAIL_CONFIG',
    exists: typeof GMAIL_CONFIG !== 'undefined'
  });
  checks.push({
    name: 'COMMON_CONFIG',
    exists: typeof COMMON_CONFIG !== 'undefined'
  });
  
  // サービスクラスの存在確認
  checks.push({
    name: 'GmailService',
    exists: typeof GmailService !== 'undefined'
  });
  checks.push({
    name: 'AIService',
    exists: typeof AIService !== 'undefined'
  });
  checks.push({
    name: 'LabelProcessor',
    exists: typeof LabelProcessor !== 'undefined'
  });
  
  // 結果出力
  console.log('環境確認結果:');
  let allOk = true;
  checks.forEach(check => {
    const status = check.exists ? '✓' : '✗';
    console.log(`${status} ${check.name}: ${check.exists ? '存在' : '不存在'}`);
    if (!check.exists) allOk = false;
  });
  
  console.log(`\n環境ステータス: ${allOk ? '正常' : '異常'}`);
  return allOk;
}

// 簡易テスト（最小限）
function runQuickTest() {
  console.log('=== 簡易テスト実行 ===');
  
  try {
    // 設定確認
    if (typeof GMAIL_CONFIG === 'undefined') {
      throw new Error('GMAIL_CONFIG が読み込まれていません');
    }
    
    // モック設定
    MockData.setupAllMocks();
    
    // 基本機能テスト
    const emails = GmailService.searchUnreadEmails();
    console.log('✓ メール検索: 正常');
    
    if (emails.length > 0) {
      const emailInfo = {
        subject: 'テスト',
        from: 'test@example.com',
        body: 'テスト本文'
      };
      
      const aiResponse = AIService.generateEmailResponse(emailInfo);
      console.log('✓ AI応答生成: 正常');
      
      const draftId = GmailService.createReplyDraft(emails[0], aiResponse.subject, aiResponse.body);
      console.log('✓ 下書き作成: 正常');
    }
    
    console.log('\n=== 簡易テスト完了: 成功 ===');
    return true;
    
  } catch (error) {
    console.error(`✗ 簡易テスト失敗: ${error.message}`);
    console.log('\n=== 簡易テスト完了: 失敗 ===');
    return false;
  }
}

// テスト結果サマリー
function getTestSummary() {
  console.log('=== テスト機能一覧 ===');
  console.log('1. runAllTests() - 全テスト実行');
  console.log('2. runUnitTests() - 単体テストのみ');
  console.log('3. runIntegrationTests() - 統合テストのみ');
  console.log('4. runSpecificTest(testName) - 特定テスト実行');
  console.log('5. checkTestEnvironment() - 環境確認');
  console.log('6. runQuickTest() - 簡易テスト');
  console.log('7. getTestSummary() - この一覧表示');
  console.log('\n使用例:');
  console.log('runQuickTest(); // まず簡易テストから');
  console.log('runUnitTests(); // 単体テスト実行');
  console.log('runAllTests(); // 全テスト実行');
}