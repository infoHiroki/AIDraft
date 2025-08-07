# AIDraft - AI自動回答システム

歯科セミナーのお問い合わせに対してAI（OpenAI GPT-4o-mini）が自動で回答案を生成し、Gmail下書きを作成するGoogle Apps Scriptシステム。

## プロジェクト構成

### 現行システム（2025年1月〜）
- **sheets/** - 統合スプレッドシート処理（V2.1管理シート方式）
- **gmail/** - Gmail未読メール処理

### アーカイブ
- **archive/** - 旧プロジェクト（01〜04）

## 主要機能
- OpenAI GPT-4o-miniによる日本語回答生成
- Gmail下書きの自動作成とラベル管理
- 1時間ごとの自動処理（トリガー設定）
- 処理状況の管理と重複防止

## セットアップ
各プロジェクトのREADME.mdを参照：
- [sheets/README.md](sheets/README.md) - スプレッドシート処理
- [gmail/README.md](gmail/README.md) - Gmail処理

## 開発者向け
詳細な技術仕様は[CLAUDE.md](CLAUDE.md)を参照してください。