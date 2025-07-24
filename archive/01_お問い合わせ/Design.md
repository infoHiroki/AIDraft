# AIDraft システム設計書

## 概要
歯科セミナー問い合わせに対するAI自動返信下書き作成システム

## 対象スプレッドシート

### 1. 歯科セミナー問い合わせ（実装済み）
- **URL**: https://docs.google.com/spreadsheets/d/18Z9j_eX7Ja6Esa32m9lZiQyzDlp4HxSkPnZhIcC5KEY/edit
- **処理**: G列空白行を対象にAI返信文生成→Gmail下書き作成

### 2. WeekendEnアンケート（将来対応）
- **URL**: https://docs.google.com/spreadsheets/d/13-tj5YmUov8m3PbVvRO2XFCzMKb3YGJT4TG0tPz_rfo/edit
- **処理**: 同様の仕組みで個別質問回答

## 実装済みGASプロジェクト
- **URL**: https://script.google.com/d/1PZ0xVB7FtEHQhyTq3GdbuN3SBBmTcXr66NCk7VVe3QJh2F2Ko_KIeN-1/edit
- **デプロイ**: Claspで管理

## アーキテクチャ
```
Google Apps Script (サーバーレス)
├── OpenAI API連携
├── Gmail API連携  
└── Spreadsheet API連携
```

## ドキュメント構成
```
docs/
├── client/          # クライアント向け
│   ├── 01_README.md   # 概要
│   ├── 02_SETUP.md    # 設定手順
│   ├── 03_USAGE.md    # 使用方法
│   └── 10_DELIVERY.md # 納品書
└── dev/             # 開発者向け  
    ├── 01_README.md   # 技術概要
    ├── 04_TEMPLATE.md # テンプレート仕様
    ├── 05_CONFIG.md   # 設定値
    └── 06_FUNCTIONS.md # 関数仕様
```

## 開発完了日
2025年6月9日

## ステータス
✅ 歯科セミナー対応完了・納品済み  
🔄 WeekendEn対応待機中