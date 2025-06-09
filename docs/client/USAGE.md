# 使用方法

## 基本操作

### 設定確認
```javascript
checkConfig()
```
- APIキー設定状況確認
- スプレッドシート接続確認

### テスト実行
```javascript
testSingleRow()
```
- 1件のみ処理
- 動作確認用

### 本格実行
```javascript
processInquiries()
```
- 未処理分をまとめて処理
- 最大20件まで

### 自動実行管理
```javascript
setupTrigger()    // 開始
deleteTriggers()  // 停止
```

## スプレッドシート仕様
- G列が空 = 未処理
- G列に「AI下書き作成済」= 処理完了
- H列: 処理日時
- I列: Gmail下書きID
- J列: 生成された返信文

## 注意事項
- 1回の実行で最大20件まで処理
- エラー時は G列に「エラー」と記録
- 下書きは自動送信されません