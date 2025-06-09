# AIDraft - 開発者向けドキュメント

## システム概要
Google Apps Script + OpenAI APIによる自動返信システム

## 技術仕様
- **言語**: Google Apps Script (JavaScript)
- **AI API**: OpenAI GPT-4o-mini
- **デプロイ**: Google Clasp
- **アーキテクチャ**: サービス指向設計

## 開発資料
- `TEMPLATE.md` - 返信テンプレート仕様
- `CONFIG.md` - システム設定値
- `FUNCTIONS.md` - 関数仕様書

## プロジェクト構成
```
src/
├── main.js              # エントリーポイント
├── config/              # 設定ファイル
├── services/            # 外部API連携
└── processors/          # 業務ロジック
```

## 拡張性
- 複数スプレッドシート対応
- 処理ロジック追加可能
- テンプレートカスタマイズ対応