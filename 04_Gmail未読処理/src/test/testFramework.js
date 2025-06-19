// シンプルテストフレームワーク（GAS用）
class TestFramework {
  constructor() {
    this.tests = [];
    this.results = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  // テストケースを追加
  addTest(name, testFunction) {
    this.tests.push({ name, testFunction });
  }

  // アサーション：等価チェック
  assertEqual(actual, expected, message = '') {
    if (actual !== expected) {
      throw new Error(`${message} - Expected: ${expected}, Actual: ${actual}`);
    }
  }

  // アサーション：真偽値チェック
  assertTrue(value, message = '') {
    if (!value) {
      throw new Error(`${message} - Expected true, got: ${value}`);
    }
  }

  // アサーション：偽値チェック
  assertFalse(value, message = '') {
    if (value) {
      throw new Error(`${message} - Expected false, got: ${value}`);
    }
  }

  // アサーション：nullでないチェック
  assertNotNull(value, message = '') {
    if (value === null || value === undefined) {
      throw new Error(`${message} - Expected not null/undefined, got: ${value}`);
    }
  }

  // アサーション：配列の長さチェック
  assertArrayLength(array, expectedLength, message = '') {
    if (!Array.isArray(array)) {
      throw new Error(`${message} - Expected array, got: ${typeof array}`);
    }
    if (array.length !== expectedLength) {
      throw new Error(`${message} - Expected length: ${expectedLength}, Actual: ${array.length}`);
    }
  }

  // 全テスト実行
  runAllTests() {
    console.log('=== テスト開始 ===');
    this.results = { passed: 0, failed: 0, errors: [] };

    this.tests.forEach(test => {
      try {
        console.log(`実行中: ${test.name}`);
        test.testFunction.call(this);
        this.results.passed++;
        console.log(`✓ ${test.name} - 成功`);
      } catch (error) {
        this.results.failed++;
        this.results.errors.push({ test: test.name, error: error.message });
        console.error(`✗ ${test.name} - 失敗: ${error.message}`);
      }
    });

    this.printResults();
    return this.results;
  }

  // テスト結果を出力
  printResults() {
    console.log('\n=== テスト結果 ===');
    console.log(`成功: ${this.results.passed}`);
    console.log(`失敗: ${this.results.failed}`);
    console.log(`合計: ${this.results.passed + this.results.failed}`);
    
    if (this.results.errors.length > 0) {
      console.log('\n=== エラー詳細 ===');
      this.results.errors.forEach(error => {
        console.log(`${error.test}: ${error.error}`);
      });
    }
  }

  // 単一テスト実行
  runTest(testName) {
    const test = this.tests.find(t => t.name === testName);
    if (!test) {
      console.error(`テストが見つかりません: ${testName}`);
      return;
    }

    try {
      console.log(`実行中: ${test.name}`);
      test.testFunction.call(this);
      console.log(`✓ ${test.name} - 成功`);
      return true;
    } catch (error) {
      console.error(`✗ ${test.name} - 失敗: ${error.message}`);
      return false;
    }
  }
}