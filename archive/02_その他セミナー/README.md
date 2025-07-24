# 02_その他セミナー - その他セミナー質問自動回答システム

## 概要
Googleフォームから送信されたその他セミナーの質問に対して、AI（OpenAI GPT-4o-mini）が自動で回答案を生成し、Gmail下書きを作成するシステム。

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
- **シート名**: `その他セミナー`
- **処理対象列**: G列（質問があれば教えてください）
- **ステータス列**: F列（事務局対応）
- **AI回答列**: 動的追加（最右端）

### Gmail設定
- **ラベル**: `AI自動回答_その他セミナー`

## 使用方法
### テスト実行
```javascript
testOtherSeminarSingleRow()
```

### 定期実行
```javascript
processOtherSeminar()
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
02_その他セミナー/
├── README.md
├── appsscript.json
└── src/
    ├── config/
    │   ├── common.js           # 共通設定
    │   └── sheets.js           # スプレッドシート設定
    ├── main.js                 # メイン関数群
    ├── processors/
    │   └── otherSeminarProcessor.js   # 処理ロジック（簡潔化済み）
    └── services/
        ├── aiService.js        # OpenAI API連携
        ├── gmailService.js     # Gmail操作
        └── sheetService.js     # 動的列検索・更新機能
```

## 処理フロー
1. スプレッドシートから未処理行（G列に質問、F列が空）を検索
2. セミナー感想と質問をAIに送信し、回答案を生成
3. Gmail下書きを作成（送信先、件名、本文、ラベル）
4. F列にステータス、AI回答列（動的）に統合情報を記録

## 特徴
- **動的列管理**: AI回答列を自動で最右端に追加
- **簡潔なコード**: 重複コードを削除し44行に圧縮
- **直接更新**: 複雑な更新関数を排除し、直接セル更新

## 注意事項
- 1回の実行で最大20件まで処理
- テスト実行は1件のみ処理
- 処理済み案件は再処理されない
- エラー時もログ記録される