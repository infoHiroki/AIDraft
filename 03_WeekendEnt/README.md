# 03_WeekendEnt - WeekendEnt質問自動回答システム

## 概要
Googleフォームから送信されたWeekendEntセミナーの質問に対して、AI（OpenAI GPT-4o-mini）が自動で回答案を生成し、Gmail下書きを作成するシステム。

## 機能
- スプレッドシートの未処理質問を自動検出
- AI による個別回答生成
- Gmail下書き自動作成（ラベル付き）
- 動的AI回答列追加機能
- 処理状況の記録・管理

## 設定
### 必要なAPI設定
- `OPENAI_API_KEY`: OpenAI APIキー

### スプレッドシート設定
- **シートID**: `1PPwXbBGdSLIC8yeQY33dNDlEqjdJ4X-PibaDPiWU6Io`
- **シート名**: `WeekendEnt`
- **処理対象列**: 動的検索（「質問」ヘッダー）
- **ステータス列**: 動的検索（「事務局対応」ヘッダー）
- **AI回答列**: 動的追加（最右端）

### Gmail設定
- **ラベル**: `AI自動回答_WeekendEnt`

## 使用方法
### テスト実行
```javascript
testWeekendEntSingleRow()
```

### 定期実行
```javascript
processWeekendEnt()
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
03_WeekendEnt/
├── README.md
├── appsscript.json
└── src/
    ├── config/
    │   ├── common.js           # 共通設定
    │   └── sheets.js           # スプレッドシート設定
    ├── main.js                 # メイン関数群
    ├── processors/
    │   └── weekendEntProcessor.js     # 処理ロジック
    └── services/
        ├── aiService.js        # OpenAI API連携
        ├── gmailService.js     # Gmail操作
        └── sheetService.js     # 動的列検索・更新機能
```

## 処理フロー
1. スプレッドシートから未処理行を動的検索
2. セミナー情報と質問をAIに送信し、回答案を生成
3. Gmail下書きを作成（送信先、件名、本文、ラベル）
4. 事務局対応列にステータス、AI回答列に統合情報を記録

## 特徴
- **完全動的処理**: ヘッダー名でカラムを自動検索
- **フォーム拡張対応**: 新しい質問項目が追加されても自動対応
- **キャッシュ機能**: カラム検索結果をキャッシュして高速化

## 注意事項
- 1回の実行で最大20件まで処理
- テスト実行は1件のみ処理
- 処理済み案件は再処理されない
- ヘッダー行は2行目に設定