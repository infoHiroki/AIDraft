# CLAUDE.md

このファイルは、このリポジトリのコードを操作する際のClaude Code (claude.ai/code) へのガイダンスを提供します。

## プロジェクト概要

AIDraftは、複数のGoogle Apps Script（GAS）プロジェクトから構成される日本語対応のAI自動メール返信システムです。OpenAIのGPT-4o-miniモデルを使用して、歯科セミナーのお問い合わせや一般的なメール処理に対するAI応答を自動生成し、Gmailの下書きを作成します。

## アーキテクチャ

プロジェクトは4つの独立したGASモジュールで構成されています：
- `01_お問い合わせ/` - 歯科セミナーお問い合わせ処理
- `02_その他セミナー/` - その他セミナーお問い合わせ処理
- `03_WeekendEnt/` - WeekendEntセミナーお問い合わせ処理
- `04_Gmail未読処理/` - Gmail未読メール処理

各モジュールは同一のアーキテクチャに従います：

### 標準ディレクトリ構造
```
[プロジェクト名]/
├── README.md               # プロジェクト固有ドキュメント
├── appsscript.json        # GAS設定ファイル
└── src/
    ├── config/
    │   ├── common.js      # 共通設定（API、ステータス）
    │   └── sheets.js      # スプレッドシート設定 (※1)
    │   └── gmail.js       # Gmail設定 (※2)
    ├── main.js            # エントリーポイント
    ├── processors/
    │   └── [name]Processor.js  # メイン処理ロジック
    └── services/
        ├── aiService.js   # OpenAI API連携
        ├── gmailService.js # Gmail操作
        └── sheetService.js # スプレッドシート操作 (※1)

※1: スプレッドシート使用プロジェクトのみ
※2: Gmailラベル自動回答のみ
```

## 開発コマンド

### デプロイ
```bash
# Google Apps Scriptにデプロイ（各プロジェクトディレクトリから実行）
clasp push
clasp deploy
```

### テスト
```bash
# GASエディタで以下の関数を実行
checkConfig()           # 設定・接続確認
testWeekendDent()       # WeekenDent 1件テスト
testOtherSeminar()      # その他セミナー 1件テスト
testInquiry()           # お問い合わせ 1件テスト
```

### 設定管理
- 各プロジェクトにはデプロイ設定用の`.clasp.json`があります
- `appsscript.json`はV8ランタイムとAmerica/New_Yorkタイムゾーンを設定
- 共通設定は`src/config/common.js`
- プロジェクト固有の設定は`src/config/sheets.js`または`src/config/gmail.js`

## 詳細設定情報

### APIキー設定

#### OpenAI API
- **設定場所**: GAS → プロジェクト設定 → スクリプトプロパティ
- **キー名**: `OPENAI_API_KEY`
- **値**: OpenAI APIキー（sk-proj-...）
- **モデル**: `gpt-4o-mini`

### スプレッドシート設定

#### 共有設定
- **共有先**: `globaldental.seminar@gmail.com`
- **権限**: 編集者
- **必要性**: スプレッドシートへのアクセスに必須

#### 01_お問い合わせ
- **ID**: `159ftLgPcrqdQU-W5UqpPcgrrZGado12kocXGFVnhzXI`
- **シート名**: `フォームの回答 1`
- **処理対象**: F列（質問）があり、G列（ステータス）が空
- **出力先**: G列（ステータス）+ H列（統合情報）
- **ラベル名**: `AI自動回答_お問い合わせ`

#### 02_その他セミナー（動的列検索機能付き）
- **ID**: `1PPwXbBGdSLIC8yeQY33dNDlEqjdJ4X-PibaDPiWU6Io`
- **シート名**: `その他セミナー`
- **処理対象**: H列（質問）があり、**動的検索した事務局対応列**が空
- **出力先**: **動的検索した事務局対応列** + **動的検索したAI回答列**
- **ラベル名**: `AI自動回答_単発`
- **特徴**: フォームに新しい質問が追加されても自動対応

#### 03_WeekendEnt（動的列検索機能付き）
- **ID**: `1PPwXbBGdSLIC8yeQY33dNDlEqjdJ4X-PibaDPiWU6Io`（02と同じスプレッドシート）
- **シート名**: `WeekenDent`（実際のシート名）
- **処理対象**: G列（質問）があり、**動的検索した事務局対応列**が空
- **出力先**: **動的検索した事務局対応列** + **動的検索したAI回答列**
- **ラベル名**: `AI自動回答_WeekendEnt`
- **特徴**: フォームに新しい質問が追加されても自動対応

### 動的列検索機能（02_その他セミナー、03_WeekendEnt）

#### 機能概要
- **目的**: Googleフォームに質問が追加されても安全に動作
- **動作**: ヘッダー名で「事務局対応」「AI回答」列を動的検索
- **フォールバック**: 見つからない場合は自動で列を追加
- **キャッシュ**: 高速化のためのキャッシュ機能付き

#### 安全性
- 既存データの上書きリスクなし
- 新しいフォーム質問が追加されても安全
- 列の順序が変わっても対応可能

### システム設定

#### 処理制限
- **1回の最大処理件数**: 20件
- **自動実行間隔**: 1時間（setupTrigger()使用時）
- **タイムアウト**: Google Apps Script 6分制限

#### Gmail設定
- **送信者**: 実行ユーザーのGmailアカウント
- **下書きラベル**: 自動作成・付与
- **自動送信**: なし（下書きのみ）
- **件名**: "Re: セミナーについてのご質問"

#### 統合出力形式
```
2025/06/09 14:25
Draft ID: abc123def456
────────────────
[AI生成回答内容]
```

### プロジェクト別関数

#### 01_お問い合わせ
- **メイン処理**: `processInquiries()` - 未処理問い合わせを最大20件まで自動処理
- **テスト実行**: `testInquiry()` - 1件のみ処理してテスト実行として記録
- **設定確認**: `checkConfig()` - APIキー設定、シート接続状況の確認
- **トリガー設定**: `setupTrigger()` - 1時間ごとの定期実行トリガーを作成
- **トリガー削除**: `deleteTriggers()` - processInquiries用のトリガーを全削除

#### 02_その他セミナー
- **メイン処理**: `processTanbatsu()` - 未処理質問を最大20件まで自動処理
- **テスト実行**: `testOtherSeminar()` - 1件のみ処理してテスト実行として記録
- **設定確認**: `checkConfig()` - APIキー設定、シート接続状況の確認
- **トリガー設定**: `setupTrigger()` - 1時間ごとの定期実行トリガーを作成
- **トリガー削除**: `deleteTriggers()` - processTanbatsu用のトリガーを全削除

#### 03_WeekendEnt
- **メイン処理**: `processWeekendEnt()` - 未処理質問を最大20件まで自動処理
- **テスト実行**: `testWeekendDent()` - 1件のみ処理してテスト実行として記録
- **設定確認**: `checkConfig()` - APIキー設定、シート接続状況の確認
- **トリガー設定**: `setupTrigger()` - 1時間ごとの定期実行トリガーを作成
- **トリガー削除**: `deleteTriggers()` - processWeekendEnt用のトリガーを全削除

#### 04_Gmail未読処理
- **メイン処理**: `processLabeledEmails()` - AI回答要求ラベル付きメールを最大10件まで自動処理
- **テスト実行**: `testSingleEmail()` - 1件のみ処理（ラベル変更なし）
- **設定確認**: `checkConfig()` - APIキー設定、Gmail権限の確認
- **トリガー設定**: `setupTrigger()` - 1時間ごとの定期実行トリガーを作成
- **トリガー削除**: `deleteTriggers()` - processLabeledEmails用のトリガーを全削除

### Gmail設定（04_Gmail未読処理専用）

#### ラベル設定
- **処理対象ラベル**: `AI回答要求` - 手動でメールに付けるラベル
- **処理済みラベル**: `AI自動回答_Gmail` - 処理完了後に自動変更

#### 処理制限
- **1回の最大処理件数**: 10件
- **自動実行間隔**: 1時間（setupTrigger()使用時）
- **対象メール**: ラベル付きメールのみ

#### Gmail動作
- **検索対象**: `AI回答要求`ラベル付きメール
- **除外条件**: `AI自動回答_Gmail`ラベル付きメール
- **処理後**: ラベル変更 + 既読化 + 返信下書き作成

## 主要技術詳細

### AIサービス統合
- OpenAI GPT-4o-miniを使用（最大500トークン、温度0.7）
- コンテキスト対応プロンプトを使った日本語応答テンプレート
- API障害時のフォールバック応答を含むエラーハンドリング

### Gmail処理
- 適切なラベル（「AI Draft」、「AI Error」）付きの下書き作成
- ステータス追跡による重複防止処理
- `gmailService.js`でのカスタムGmail API統合

### Googleスプレッドシート統合
- 設定可能なマッピングによる列ベースのデータ抽出
- 重複処理防止のためのステータス追跡
- 個別エラー分離によるバッチ処理

### トリガーシステム
- 本番処理用の毎時自動トリガー
- 単一項目テスト用の手動トリガー関数
- 各プロジェクトでのトリガー管理機能（設定/削除）

### テスト方法
GAS環境での実際のデータを使用したテスト：
- `checkConfig()` - 設定確認（API、Gmail、スプレッドシート接続）
- `test○○○()` - 各シートの1件実処理テスト
- 実際のスプレッドシートとGmail APIを使用
- エラー発生時は詳細ログで問題を特定

### 返信テンプレート

```
${info.clinicName}
${info.doctorName}先生

GDX事務局 中村です。
お世話になります。

セミナーに参加していただき、ありがとうございました。
また、アンケートのご返答、ありがとうございます｡

先生から頂きました質問は以下です。

━━━━━━━━━━━━━━━━
[ここに質問内容を記載]
━━━━━━━━━━━━━━━━

以下、回答です。

━━━━━━━━━━━━━━━━
[ここに適切な回答を記載してください]
━━━━━━━━━━━━━━━━

何かご質問があれば、お気軽に聞いて下さい。
どうぞよろしくお願いします。

GDX事務局 中村
seminar@globaldentalx.com
03-4510-4792
```

## 一般的な開発パターン

### エラーハンドリング
すべてのサービスは一貫したエラーハンドリングを実装：
- 外部API呼び出し周りのtry-catchブロック
- データソースでのステータス追跡
- デバッグ用の詳細ログ
- 個別項目障害に対する優雅な劣化

### ステータス管理
標準ステータスフロー：`未処理` → `処理中` → `完了` または `エラー`

### サービス層パターン
各サービス（AI、Gmail、Sheets）は以下で分離：
- 外部依存関係のクリーンインターフェース
- 設定の注入
- エラー境界ハンドリング
- ログ統合

## 技術アーキテクチャ詳細

### 共通技術スタック

#### プラットフォーム
- **実行環境**: Google Apps Script (GAS)
- **言語**: JavaScript (ES6+)
- **デプロイ**: Google Clasp
- **バージョン管理**: Git

#### 外部API
- **AI**: OpenAI GPT-4o-mini
- **メール**: Gmail API
- **スプレッドシート**: Google Sheets API

#### 認証・権限
- **Gmail**: OAuth 2.0
- **Sheets**: OAuth 2.0
- **OpenAI**: API Key認証

### 共通設定ファイル

#### common.js（全プロジェクト共通）
```javascript
const COMMON_CONFIG = {
  // OpenAI API設定
  OPENAI: {
    MODEL: 'gpt-4o-mini',
    MAX_TOKENS: 500,
    TEMPERATURE: 0.7,
    API_URL: 'https://api.openai.com/v1/chat/completions'
  },
  
  // 共通ステータス
  STATUS: {
    PENDING: '',
    PROCESSING: '処理中', 
    COMPLETED: 'AI回答作成済',
    ERROR: 'エラー',
    TEST: 'テスト実行'
  },
  
  // エラーメッセージ
  ERROR_MESSAGES: {
    NO_API_KEY: 'APIキーが設定されていません',
    SHEET_NOT_FOUND: 'シートが見つかりません',
    API_ERROR: 'API Error'
  }
};
```

### 共通サービス

#### aiService.js（AI回答生成）
```javascript
class AIService {
  static async generate[Type]Response(data) {
    // プロジェクト固有のプロンプト生成
    // OpenAI API呼び出し
    // レスポンス整形・返却
  }
}
```

#### gmailService.js（Gmail操作）
```javascript
class GmailService {
  static createDraft(to, subject, body, labelName) {
    // Gmail下書き作成
    // ラベル付与
    // Draft ID返却
  }
}
```

#### sheetService.js（スプレッドシート操作）
```javascript
class SheetService {
  static getSheet(sheetId, sheetName) { /* シート取得 */ }
  static getColumnIndexByHeader(sheet, headerName, options) { /* 動的列検索 */ }
  static updateResponse(sheet, rowIndex, ...) { /* 結果更新 */ }
}
```

### 共通処理パターン

#### 1. 初期化・設定確認
```javascript
function checkConfig() {
  // API Key確認
  // シート/Gmail接続確認  
  // 設定値出力
}
```

#### 2. メイン処理フロー
```javascript
static process() {
  // 1. データ源からの未処理データ取得
  // 2. 処理条件判定
  // 3. AI回答生成
  // 4. Gmail下書き作成
  // 5. ステータス更新
  // 6. ログ出力
}
```

#### 3. テスト実行
```javascript
static testSingleRow() {
  // メイン処理の1件限定版
  // 詳細ログ出力
}
```

#### 4. トリガー管理
```javascript
function setupTrigger() {
  // 既存トリガー削除
  // 新規トリガー作成（1時間間隔）
}
```

### 共通エラーハンドリング

#### エラー分類
1. **設定エラー**: API Key未設定、シート不存在
2. **API エラー**: OpenAI API、Gmail API制限
3. **データエラー**: 不正なデータ形式
4. **システムエラー**: GAS実行時間制限

#### エラー記録方式
- **スプレッドシート系**: セルにエラー情報記録
- **Gmail系**: エラーラベル付与
- **共通**: console.error()でログ出力

### 共通セキュリティ対策

#### API Key管理
- スクリプトプロパティで保存
- コードに直接記載禁止
- 定期的なローテーション推奨

#### 権限管理
- 必要最小限の権限要求
- スプレッドシート共有設定
- Gmail読み取り/書き込み権限

#### データ保護
- 個人情報の適切な取り扱い
- ログでの機密情報出力回避
- API使用量の監視

### 共通パフォーマンス最適化

#### 実行時間制限対策
- 1回の実行件数制限（10-20件）
- バッチ処理によるAPI効率化
- タイムアウト設定

#### API使用量最適化
- OpenAI API: トークン数制限
- Gmail API: レート制限遵守
- Sheets API: バッチ更新

#### キャッシュ戦略
- 列インデックスのキャッシュ（WeekendEnt）
- 設定値のキャッシュ
- API レスポンスの適切な処理

## プロジェクト固有の注意事項

### Gmailプロセッサ（04_Gmail未読処理）
- 指定されたGmailラベルからの未読メールを処理
- 包括的なテストスイートを含む
- `config/gmail.js`でのGmail固有設定を使用

### セミナープロセッサ（01-03）
- GoogleフォームのGoogleスプレッドシート経由の応答を処理
- AI応答生成のためのお問い合わせ詳細を抽出
- `config/sheets.js`でのスプレッドシート固有設定を使用

## 重要な制約

- Google Apps Scriptの6分実行時間制限
- V8ランタイム環境（ES6+サポート）
- npm/node_modulesなし - 純粋なGAS環境
- 一貫したスケジュール設定のためAmerica/New_Yorkタイムゾーンに設定

## 移行履歴

### v2.0 統合リファクタリング（2025年実施）
- 01-03番のプロジェクトを `sheets/` に統合
- 04番のプロジェクトを `gmail/` にリネーム
- 動的列検索を廃止し、固定列マッピングに移行
- スプレッドシートを1つに統合（複数シート構成）
- 設定駆動型アーキテクチャの採用

### 旧プロジェクト
- `archive/` ディレクトリに保存
- 参照用として維持
- 新規開発は統合プロジェクトを使用