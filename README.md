# AIDraft - AI自動回答システム

## 概要
Googleフォーム・Gmail受信メールに対してAI（OpenAI GPT-4o-mini）が自動で回答案を生成し、Gmail下書きを作成するシステム。

2025年1月にリファクタリングを実施し、旧来の4つの独立プロジェクトから2つの統合システムに再編成されました。

## 現在のプロジェクト構成

### sheets/ - 統合スプレッドシート処理システム
3つのシートを1つのシステムで処理する統合プロジェクト
- **対象**: 1つのスプレッドシート内の3つのシート
  - WeekenDentシート（WeekendDentセミナー）
  - その他セミナーシート
  - お問い合わせシート
- **処理**: AI回答生成 → Gmail下書き作成
- **特徴**: 設定駆動型、固定列マッピング、データ上書きリスクなし

### gmail/ - Gmail未読処理システム  
Gmail未読メールの自動回答処理
- **対象**: 指定ラベル付きGmail未読メール
- **処理**: AI回答生成 → 返信下書き作成
- **特徴**: 包括的テストスイート、ラベルベース管理

### archive/ - 旧プロジェクト（参照用）
リファクタリング前の独立プロジェクト群
- 01_お問い合わせ/ - 歯科セミナーお問い合わせ（→ sheets/に統合）
- 02_その他セミナー/ - その他セミナー質問（→ sheets/に統合）
- 03_WeekendEnt/ - WeekendEntセミナー質問（→ sheets/に統合）
- 04_Gmail未読処理/ - Gmail処理（→ gmail/にリネーム）

## 共通機能
- **AI回答生成**: OpenAI GPT-4o-mini による自然な回答
- **Gmail下書き作成**: 自動ラベル付与
- **処理状況管理**: ステータス記録・重複処理防止
- **定期実行**: 1時間間隔のトリガー設定
- **テスト機能**: 1件ずつの動作確認

## 技術仕様
- **プラットフォーム**: Google Apps Script
- **AI API**: OpenAI GPT-4o-mini
- **デプロイ**: Google Clasp
- **言語**: JavaScript (ES6+)

## セットアップ

### sheets/プロジェクト
1. `sheets/README.md`を参照
2. OpenAI APIキーをGASスクリプトプロパティに設定
3. スプレッドシートを`globaldental.seminar@gmail.com`に共有
4. `clasp push && clasp deploy`でデプロイ

### gmail/プロジェクト  
1. `gmail/README.md`を参照
2. OpenAI APIキーをGASスクリプトプロパティに設定
3. Gmail権限を設定
4. `clasp push && clasp deploy`でデプロイ

## ディレクトリ構造
```
AIDraft/
├── README.md                    # 全体概要（このファイル）
├── CLAUDE.md                    # Claude Code向けガイド
├── sheets/                      # 統合スプレッドシート処理
│   ├── README.md
│   └── src/
├── gmail/                       # Gmail未読処理
│   ├── README.md
│   └── src/
├── archive/                     # 旧プロジェクト（参照用）
│   ├── 01_お問い合わせ/
│   ├── 02_その他セミナー/
│   ├── 03_WeekendEnt/
│   └── 04_Gmail未読処理/
└── docs/                        # 開発ドキュメント
    ├── client/                  # クライアント向け
    └── dev/                     # 開発者向け
```

## 運用

### 現行システム（推奨）
- **sheets/**: 3つのシートを統合処理、1時間ごとの自動実行
- **gmail/**: Gmail未読メール処理、1時間ごとの自動実行
- 各システムは独立したGASプロジェクトとして運用
- 処理状況はスプレッドシート・Gmail内で確認可能

### 旧システム（非推奨）
- archive/内の旧プロジェクトは参照用として保持
- 新規開発・保守は現行システムを使用

## 注意事項
- OpenAI API使用量の監視が必要
- Gmail API制限に注意
- 定期的なログ確認を推奨