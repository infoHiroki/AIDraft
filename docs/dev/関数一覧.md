# 関数リファレンス

## 主要関数

### processInquiries()
**用途**: メイン処理（定期実行用）
**処理**: 未処理の問い合わせを最大20件まで自動処理
**戻り値**: 処理件数
```javascript
const count = processInquiries();
console.log(`${count}件処理しました`);
```

### testSingleRow()
**用途**: テスト実行
**処理**: 未処理の1件のみ処理してテスト
**戻り値**: 処理件数（0または1）
```javascript
testSingleRow();
```

### setupTrigger()
**用途**: 自動実行設定
**処理**: 1時間ごとのトリガー作成
**注意**: 既存トリガーは自動削除
```javascript
setupTrigger();
```

### deleteTriggers()
**用途**: 自動実行停止
**処理**: processInquiries用トリガーを全削除
```javascript
deleteTriggers();
```

### checkConfig()
**用途**: 設定確認・接続テスト
**処理**: APIキー、シート接続の確認
```javascript
checkConfig();
```

## 内部関数

### DentalSeminarProcessor.process()
- 歯科セミナー専用の処理ロジック
- スプレッドシート読み取り〜Gmail下書き作成

### AIService.generateDentalSeminarDraft(inquiryInfo)
- OpenAI APIで返信文生成
- 引数: 問い合わせ情報オブジェクト

### GmailService.createDraft(to, subject, body, labelName)
- Gmail下書き作成
- ラベル自動付与

### SheetService.updateStatus(sheet, rowIndex, status, ...)
- スプレッドシート状況更新
- G〜J列への一括書き込み