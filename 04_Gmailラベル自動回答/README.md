# 04_Gmailラベル自動回答 - Gmail受信メール自動回答システム

## 概要
特定のGmailラベルが付けられたメールに対して、AI（OpenAI GPT-4o-mini）が自動で回答案を生成し、Gmail下書きを作成するシステム。

## 機能
- 指定ラベルの未処理メールを自動検出
- メール内容に基づくAI回答生成
- Gmail下書き自動作成
- 処理済みメールの管理

## 設定
### 必要なAPI設定
- `OPENAI_API_KEY`: OpenAI APIキー

### Gmail設定
- **処理対象ラベル**: 設定ファイルで指定
- **除外ラベル**: 処理済みメールを識別

## 使用方法
### テスト実行
```javascript
testSingleEmail()
```

### 定期実行
```javascript
processLabeledEmails()
```

### トリガー設定
```javascript
setupTrigger()  // 1時間間隔
deleteTriggers()  // トリガー削除
```

### 設定確認
```javascript
checkConfig()
```

## ファイル構成
```
04_Gmailラベル自動回答/
├── README.md
├── appsscript.json
└── src/
    ├── config/
    │   ├── common.js           # 共通設定
    │   └── gmail.js            # Gmail設定
    ├── main.js                 # メイン関数群
    ├── processors/
    │   └── labelProcessor.js   # メール処理ロジック
    └── services/
        ├── aiService.js        # OpenAI API連携
        └── gmailService.js     # Gmail操作
```

## 処理フロー
1. 指定ラベルの未処理メールを検索
2. メール内容をAIに送信し、回答案を生成
3. 返信下書きを作成
4. 処理済みラベルを付与

## 特徴
- **ラベルベース処理**: Gmailラベルで処理対象を管理
- **メール自動検出**: 新着メールを自動で処理
- **重複処理防止**: 処理済みメールは再処理されない

## 注意事項
- 1回の実行で処理件数制限あり
- テスト実行は1件のみ処理
- 処理済みメールは除外される