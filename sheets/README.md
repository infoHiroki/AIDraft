# AIDraft Sheets

スプレッドシート処理の統合プロジェクト。3つのシートから質問を取得し、AI回答を生成してGmail下書きを作成します。

## 処理対象

- **WeekendDent**: F列（質問）→ G列（事務局対応）
- **その他セミナー**: F列（質問）→ G列（事務局対応）  
- **お問い合わせ**: F列（質問）→ H列（事務局対応）

## 主要な関数

- `processWeekendDent()` - WeekendDentシートの処理
- `processOtherSeminar()` - その他セミナーシートの処理
- `processInquiry()` - お問い合わせシートの処理

## テスト関数

- `testWeekendDent()` - WeekendDentの1件テスト
- `testOtherSeminar()` - その他セミナーの1件テスト
- `testInquiry()` - お問い合わせの1件テスト

## 設定確認

- `checkConfig()` - 全シートの設定確認

## トリガー管理

- `setupTriggers()` - 全シート用トリガー設定
- `deleteTriggers()` - 全トリガー削除