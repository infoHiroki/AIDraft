/**
 * 単体テスト
 * 各サービスクラスの機能をテスト
 */

/**
 * 単体テストを実行
 */
function runUnitTests() {
  console.log('=== 単体テスト開始 ===');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };
  
  // シート設定テスト
  testSheetConfig(results);
  
  // シートサービステスト
  testSheetService(results);
  
  // Gmailサービステスト
  testGmailService(results);
  
  // 共通ユーティリティテスト
  testUtilities(results);
  
  console.log('=== 単体テスト完了 ===');
  console.log(`成功: ${results.passed}, 失敗: ${results.failed}`);
  
  return results;
}

/**
 * シート設定テスト
 */
function testSheetConfig(results) {
  console.log('--- シート設定テスト ---');
  
  // 設定取得テスト
  try {
    const weekendConfig = getSheetConfig('WEEKEND');
    assertEqual(weekendConfig.sheetName, 'WeekendDent', 'WeekendDentシート名');
    assertEqual(weekendConfig.questionColumn, 'F', 'WeekendDent質問列');
    assertEqual(weekendConfig.statusColumn, 'G', 'WeekendDentステータス列');
    recordTest(results, 'WeekendDent設定取得', true);
  } catch (error) {
    recordTest(results, 'WeekendDent設定取得', false, error.message);
  }
  
  try {
    const inquiryConfig = getSheetConfig('INQUIRY');
    assertEqual(inquiryConfig.sheetName, '#GDX、ウィークエンデント、単発、黒飛出演', 'お問い合わせシート名');
    assertEqual(inquiryConfig.questionColumn, 'F', 'お問い合わせ質問列');
    assertEqual(inquiryConfig.statusColumn, 'H', 'お問い合わせステータス列'); // H列であることを確認
    recordTest(results, 'お問い合わせ設定取得', true);
  } catch (error) {
    recordTest(results, 'お問い合わせ設定取得', false, error.message);
  }
  
  // 不正な設定取得テスト
  try {
    getSheetConfig('INVALID');
    recordTest(results, '不正設定エラーハンドリング', false, '例外が発生しませんでした');
  } catch (error) {
    recordTest(results, '不正設定エラーハンドリング', true);
  }
}

/**
 * シートサービステスト
 */
function testSheetService(results) {
  console.log('--- シートサービステスト ---');
  
  // 列インデックス変換テスト
  try {
    assertEqual(SheetService.getColumnIndex('A'), 0, 'A列インデックス');
    assertEqual(SheetService.getColumnIndex('B'), 1, 'B列インデックス');
    assertEqual(SheetService.getColumnIndex('Z'), 25, 'Z列インデックス');
    recordTest(results, '列インデックス変換', true);
  } catch (error) {
    recordTest(results, '列インデックス変換', false, error.message);
  }
  
  // 設定確認テスト（実際のシートアクセスなし）
  try {
    const configs = getAllSheetConfigs();
    assertTrue(Object.keys(configs).length > 0, '設定が存在する');
    assertTrue('WEEKEND' in configs, 'WEEKEND設定が存在する');
    assertTrue('OTHER' in configs, 'OTHER設定が存在する');
    assertTrue('INQUIRY' in configs, 'INQUIRY設定が存在する');
    recordTest(results, '全設定取得', true);
  } catch (error) {
    recordTest(results, '全設定取得', false, error.message);
  }
}

/**
 * Gmailサービステスト
 */
function testGmailService(results) {
  console.log('--- Gmailサービステスト ---');
  
  // Gmail設定確認テスト
  try {
    const gmailResult = GmailService.checkGmailAccess();
    assertTrue(typeof gmailResult === 'object', 'Gmail設定確認結果がオブジェクト');
    assertTrue('accessible' in gmailResult, '結果にaccessibleフィールドが存在');
    recordTest(results, 'Gmail設定確認', true);
  } catch (error) {
    recordTest(results, 'Gmail設定確認', false, error.message);
  }
}

/**
 * 共通ユーティリティテスト
 */
function testUtilities(results) {
  console.log('--- 共通ユーティリティテスト ---');
  
  // UnifiedProcessorの列インデックス変換テスト
  try {
    assertEqual(UnifiedProcessor.getColumnIndex('A'), 0, 'UnifiedProcessor A列インデックス');
    assertEqual(UnifiedProcessor.getColumnIndex('H'), 7, 'UnifiedProcessor H列インデックス');
    recordTest(results, 'UnifiedProcessor列変換', true);
  } catch (error) {
    recordTest(results, 'UnifiedProcessor列変換', false, error.message);
  }
}

// ===================
// テストユーティリティ関数
// ===================

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: 期待値 ${expected}, 実際値 ${actual}`);
  }
}

function assertTrue(condition, message) {
  if (!condition) {
    throw new Error(`${message}: 条件がfalseです`);
  }
}

function assertFalse(condition, message) {
  if (condition) {
    throw new Error(`${message}: 条件がtrueです`);
  }
}

function assertNotNull(value, message) {
  if (value === null || value === undefined) {
    throw new Error(`${message}: 値がnullまたはundefinedです`);
  }
}

function recordTest(results, testName, passed, errorMessage = null) {
  if (passed) {
    results.passed++;
    console.log(`✓ ${testName}`);
  } else {
    results.failed++;
    console.log(`✗ ${testName}: ${errorMessage}`);
  }
  
  results.tests.push({
    name: testName,
    passed: passed,
    error: errorMessage
  });
}