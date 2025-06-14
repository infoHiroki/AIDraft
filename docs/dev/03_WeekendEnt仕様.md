# 03_WeekendEnt - 技術仕様書

## プロジェクト概要
- **プロジェクト名**: 03_WeekendEnt
- **用途**: WeekendEntセミナー質問フォーム自動回答
- **GASプロジェクトID**: 設定済み

## スプレッドシート仕様
- **シートID**: `1PPwXbBGdSLIC8yeQY33dNDlEqjdJ4X-PibaDPiWU6Io`
- **シート名**: `WeekendEnt`
- **ヘッダー行**: 2行目（特殊）

### カラム構成（完全動的）
| ヘッダー名 | 内容 | 処理 |
|---|---|---|
| Email Address | メールアドレス | Gmail送信先 |
| 事務局対応 | ステータス | **動的検索**・処理状況記録 |
| 質問 | 質問内容 | **動的検索**・処理対象 |
| AI回答 | AI生成内容 | **動的追加** |
| その他項目 | フォーム項目 | AI回答生成に使用 |

## 処理ロジック
### 処理条件
- 「質問」列に内容がある
- 「事務局対応」列が空

### 処理フロー（完全動的）
1. ヘッダー名で必要列を動的検索
2. 未処理行を検索（最大20件）
3. AI回答列を動的検索/作成
4. 全項目を取得してAI回答生成
5. Gmail下書き作成
6. ステータス更新（動的列に記録）

### 動的列検索
```javascript
// ヘッダー行2行目で動的検索
const columnIndices = SheetService.getMultipleColumnIndices(
  sheet,
  ['事務局対応', '質問', 'Email Address'],
  { headerRow: 2, createIfNotFound: true }
);
```

## AI回答生成
### 入力データ（動的）
```javascript
{
  email: "メールアドレス",
  // その他すべてのフォーム項目を動的に含める
  ...allFormData,
  question: "質問内容"
}
```

### 回答テンプレート
- WeekendEntセミナーに特化
- 参加感謝・質問回答
- 具体的で有用な情報提供

## 動的列管理の特徴
### 完全フォーム拡張対応
- 新しい質問項目が追加されても自動対応
- ヘッダー名で列を識別
- 既存データの影響なし

### キャッシュ機能
```javascript
// カラムインデックスをキャッシュして高速化
SheetService.columnCache = new Map();
```

### ヘッダー行対応
- 他プロジェクトは1行目、WeekendEntのみ2行目
- ヘッダー行設定で柔軟対応

## Gmail設定
- **ラベル**: `AI自動回答_WeekendEnt`
- **件名形式**: WeekendEnt質問の回答
- **送信者**: 設定済みGmailアカウント

## ステータス管理
- `処理中`: 処理開始時
- `AI回答作成済`: 正常完了
- `エラー`: 処理失敗
- `テスト実行`: テスト時

## 実行関数
- `processWeekendEnt()`: 定期実行（最大20件）
- `testWeekendEntSingleRow()`: テスト実行（1件）
- `setupTrigger()`: 1時間間隔トリガー設定
- `checkConfig()`: 設定確認

## 設定項目
### スクリプトプロパティ
- `OPENAI_API_KEY`: OpenAI APIキー

### 制限事項
- 1実行あたり最大20件
- API使用量制限に注意
- ヘッダー行は2行目固定

## ファイル構成
```
03_WeekendEnt/
├── src/config/
│   ├── common.js           # API設定、ステータス定数
│   └── sheets.js           # WEEKEND_ENT設定（headerRow: 2）
├── src/processors/
│   └── weekendEntProcessor.js     # 完全動的処理ロジック
├── src/services/
│   ├── aiService.js        # OpenAI API連携
│   ├── gmailService.js     # Gmail操作
│   └── sheetService.js     # 高度な動的列検索・キャッシュ
└── main.js                 # processWeekendEnt等
```

## 技術的特徴
1. **完全動的処理**: すべての列をヘッダー名で検索
2. **フォーム拡張対応**: 新項目追加時も自動対応
3. **高性能キャッシュ**: 列検索結果をキャッシュ
4. **安全な列追加**: 既存データを保護
5. **特殊ヘッダー行**: 2行目ヘッダーに対応

## WeekendEnt特有の仕様
- ヘッダー行が2行目（他は1行目）
- より多くのフォーム項目
- 完全動的処理によるフォーム変更への対応

## デプロイ手順
1. Clasp設定確認
2. スクリプトプロパティ設定
3. スプレッドシート共有
4. `clasp push`でデプロイ
5. テスト実行で動作確認
6. ヘッダー行設定（2行目）の確認