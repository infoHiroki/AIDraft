# 04_Gmail未読処理 - Gmail未読メール自動回答システム

## 概要
Gmail未読メールに対して、AI（OpenAI GPT-4o-mini）が自動で回答案を生成し、Gmail下書きを作成するシステム。KISS原則に基づくシンプル設計。

## 機能
- 未読メールの自動検出（除外ラベル考慮）
- メール内容に基づくAI回答生成
- Gmail下書き自動作成
- 既読による処理済み管理

## 設定
### 必要なAPI設定
- `OPENAI_API_KEY`: OpenAI APIキー

### Gmail設定
- **除外ラベル**: `ai処理不要`（処理対象外メール）
- **結果ラベル**: `AI自動回答_Gmail`（処理完了表示）

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
04_Gmail未読処理/
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

## 処理フロー（KISS原則）
1. 未読メールを検索（`ai処理不要`ラベル除く）
2. メール内容をAIに送信し、回答案を生成
3. 返信下書きを作成
4. 既読化＋`AI自動回答_Gmail`ラベル付与

## 特徴
- **シンプル設計**: 既読=処理済みで確実な重複防止
- **柔軟な除外**: `ai処理不要`ラベルで個別制御
- **明確な状態**: 未読/既読で処理状況が一目瞭然

## 注意事項
- 1回の実行で処理件数制限あり
- テスト実行は1件のみ処理
- 既読メールは処理対象外