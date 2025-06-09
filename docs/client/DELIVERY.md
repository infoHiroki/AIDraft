# 【納品】AIDraft - AI自動下書きシステム

## 納品内容

### 1. Google Apps Script プロジェクト
**URL**: https://script.google.com/d/1PZ0xVB7FtEHQhyTq3GdbuN3SBBmTcXr66NCk7VVe3QJh2F2Ko_KIeN-1/edit

### 2. 対象スプレッドシート
歯科セミナー問い合わせ管理シート
- ID: `18Z9j_eX7Ja6Esa32m9lZiQyzDlp4HxSkPnZhIcC5KEY`

### 3. 主要機能
- ✅ AI自動返信文生成 (OpenAI GPT-4)
- ✅ Gmail下書き自動作成
- ✅ スプレッドシート連携
- ✅ 1時間ごと自動実行

## セットアップ手順 (5分)

1. **APIキー設定**
   - GAS → プロジェクト設定 → スクリプトプロパティ
   - `OPENAI_API_KEY` = [OpenAI APIキー]

2. **動作確認**
   ```javascript
   checkConfig()     // 設定確認
   testSingleRow()   // テスト実行
   ```

3. **自動実行開始**
   ```javascript
   setupTrigger()    // 1時間ごと自動実行開始
   ```

## 日常運用

### 自動処理
- 1時間ごとに自動実行
- 未処理分(G列空白)を自動処理
- Gmail下書きを自動作成

### 手動実行
```javascript
processInquiries()  // 手動で全件処理
```

### 停止
```javascript
deleteTriggers()    // 自動実行停止
```

## 処理結果の確認

| 列 | 内容 |
|----|------|
| G列 | ステータス(AI下書き作成済/エラー) |
| H列 | 処理日時 |
| I列 | Gmail下書きID |
| J列 | 生成された返信文 |

## サポート

設定・運用でご不明点があれば開発者までお問い合わせください。

---
**開発完了日**: 2025年6月9日