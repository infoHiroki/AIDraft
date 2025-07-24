/**
 * 統合テスト
 * 実際のスプレッドシートとGmailを使用したエンドツーエンドテスト
 */

/**
 * 統合テストを実行
 */
function runIntegrationTests() {
  console.log('=== 統合テスト開始 ===');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };
  
  // 設定確認テスト
  testConfigIntegration(results);
  
  // シートアクセステスト
  testSheetAccess(results);
  
  // データ抽出テスト
  testDataExtraction(results);
  
  // Gmail接続テスト
  testGmailIntegration(results);
  
  console.log('=== 統合テスト完了 ===');
  console.log(`成功: ${results.passed}, 失敗: ${results.failed}`);
  
  return results;
}

/**
 * 設定確認統合テスト
 */
function testConfigIntegration(results) {
  console.log('--- 設定確認統合テスト ---');
  
  try {
    const configResult = checkConfig();
    assertNotNull(configResult, '設定確認結果');
    assertTrue('apiKey' in configResult, 'APIキー確認結果');
    assertTrue('gmail' in configResult, 'Gmail確認結果');
    assertTrue('sheets' in configResult, 'シート確認結果');
    recordIntegrationTest(results, '全体設定確認', true);
  } catch (error) {
    recordIntegrationTest(results, '全体設定確認', false, error.message);
  }
}

/**
 * シートアクセステスト
 */
function testSheetAccess(results) {
  console.log('--- シートアクセステスト ---');
  
  const sheetTypes = ['WEEKEND', 'OTHER', 'INQUIRY'];
  
  for (const sheetType of sheetTypes) {
    try {
      const config = getSheetConfig(sheetType);
      const sheet = SheetService.getSheet(SHEET_CONFIG.SPREADSHEET_ID, config.sheetName);
      
      assertNotNull(sheet, `${sheetType}シート取得`);
      assertTrue(sheet.getLastRow() > 0, `${sheetType}シートにデータが存在`);
      
      recordIntegrationTest(results, `${sheetType}シートアクセス`, true);
    } catch (error) {
      recordIntegrationTest(results, `${sheetType}シートアクセス`, false, error.message);
    }
  }
}

/**
 * データ抽出テスト
 */
function testDataExtraction(results) {
  console.log('--- データ抽出テスト ---');
  
  const sheetTypes = ['WEEKEND', 'OTHER', 'INQUIRY'];
  
  for (const sheetType of sheetTypes) {
    try {
      const config = getSheetConfig(sheetType);
      const sheet = SheetService.getSheet(SHEET_CONFIG.SPREADSHEET_ID, config.sheetName);
      
      // ヘッダー行を取得してデータ構造を確認
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      assertTrue(headers.length > 0, `${sheetType}ヘッダーが存在`);
      
      // 質問列とステータス列の存在確認
      const questionIndex = UnifiedProcessor.getColumnIndex(config.questionColumn);
      const statusIndex = UnifiedProcessor.getColumnIndex(config.statusColumn);
      
      assertTrue(questionIndex < headers.length, `${sheetType}質問列が範囲内`);
      assertTrue(statusIndex < headers.length, `${sheetType}ステータス列が範囲内`);
      
      recordIntegrationTest(results, `${sheetType}データ構造確認`, true);
    } catch (error) {
      recordIntegrationTest(results, `${sheetType}データ構造確認`, false, error.message);
    }
  }
}

/**
 * Gmail統合テスト
 */
function testGmailIntegration(results) {
  console.log('--- Gmail統合テスト ---');
  
  try {
    const gmailResult = GmailService.checkGmailAccess();
    assertTrue(gmailResult.accessible, 'Gmailアクセス可能');
    assertNotNull(gmailResult.userEmail, 'ユーザーメール取得');
    
    recordIntegrationTest(results, 'Gmail接続確認', true);
  } catch (error) {
    recordIntegrationTest(results, 'Gmail接続確認', false, error.message);
  }
  
  // ラベル作成テスト（実際には作成しない）
  try {
    const existingLabels = GmailApp.getUserLabels();
    assertTrue(Array.isArray(existingLabels), 'ラベル一覧取得');
    
    recordIntegrationTest(results, 'Gmailラベル機能', true);
  } catch (error) {
    recordIntegrationTest(results, 'Gmailラベル機能', false, error.message);
  }
}

/**
 * 実際のデータ処理テスト（慎重に実行）
 */
function testActualProcessing() {
  console.log('=== 実データ処理テスト（注意：実際に処理を実行します） ===');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };
  
  console.log('警告: このテストは実際のデータを処理します。実行前に確認してください。');
  
  // WeekendDentの1件テスト
  try {
    const count = testWeekendDent();
    assertTrue(count >= 0, 'WeekendDentテスト実行');
    recordIntegrationTest(results, 'WeekendDent実処理テスト', true, `処理件数: ${count}`);
  } catch (error) {
    recordIntegrationTest(results, 'WeekendDent実処理テスト', false, error.message);
  }
  
  console.log('実データ処理テスト完了:', results);
  return results;
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

function recordIntegrationTest(results, testName, passed, message = null) {
  if (passed) {
    results.passed++;
    console.log(`✓ ${testName}${message ? ` (${message})` : ''}`);
  } else {
    results.failed++;
    console.log(`✗ ${testName}: ${message}`);
  }
  
  results.tests.push({
    name: testName,
    passed: passed,
    message: message
  });
}