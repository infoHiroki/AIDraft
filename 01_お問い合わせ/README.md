# 01_お問い合わせ - 歯科セミナーお問い合わせ自動回答システム

## 概要
Googleフォームから送信された歯科セミナーお問い合わせに対して、AI（OpenAI GPT-4o-mini）が自動で回答案を生成し、Gmail下書きを作成するシステム。

## 機能
- スプレッドシートの未処理お問い合わせを自動検出
- AI による個別回答生成
- Gmail下書き自動作成（ラベル付き）
- 処理状況の記録・管理

## 設定
### 必要なAPI設定
- `OPENAI_API_KEY`: OpenAI APIキー

### スプレッドシート設定
- **シートID**: `159ftLgPcrqdQU-W5UqpPcgrrZGado12kocXGFVnhzXI`
- **シート名**: `フォームの回答 1`
- **処理対象列**: D列（お問い合わせ内容）
- **ステータス列**: E列（事務局対応）

### Gmail設定
- **ラベル**: `AI自動回答_歯科セミナー`

## 使用方法
### テスト実行
```javascript
testDentalSeminarSingleRow()
```

### 定期実行
```javascript
processDentalSeminar()
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
01_お問い合わせ/
├── README.md
├── Design.md
├── appsscript.json
└── src/
    ├── config/
    │   ├── common.js           # 共通設定
    │   └── sheets.js           # スプレッドシート設定
    ├── main.js                 # メイン関数群
    ├── processors/
    │   └── dentalSeminarProcessor.js  # 処理ロジック
    └── services/
        ├── aiService.js        # OpenAI API連携
        ├── gmailService.js     # Gmail操作
        └── sheetService.js     # スプレッドシート操作
```

## 処理フロー
1. スプレッドシートから未処理行（D列に内容、E列が空）を検索
2. お問い合わせ情報をAIに送信し、回答案を生成
3. Gmail下書きを作成（送信先、件名、本文、ラベル）
4. E列にステータス、F列にAI回答詳細を記録

## 注意事項
- 1回の実行で最大20件まで処理
- テスト実行は1件のみ処理
- 処理済み案件は再処理されない
- エラー時もログ記録される