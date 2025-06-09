# AIDraft - AI自動下書きシステム

Googleフォームからの問い合わせに対するAI自動返信下書き作成システム

## プロジェクト構成

```
AIDraft/
├── 01_お問い合わせ/              # GDX歯科セミナー問い合わせ管理
├── 02_単発/                     # 単発セミナーアンケート管理
├── 03_WeekendEnt/               # WeekendEntセミナーアンケート管理
├── docs/                        # ドキュメント
└── shared/                      # 共通ライブラリ（将来用）
```

## 各プロジェクト

### 01_お問い合わせ
- **対象**: GDX歯科セミナーの問い合わせ
- **状態**: ✅ 開発完了・納品済み
- **GAS URL**: https://script.google.com/d/1PZ0xVB7FtEHQhyTq3GdbuN3SBBmTcXr66NCk7VVe3QJh2F2Ko_KIeN-1/edit

### 02_単発
- **対象**: 単発セミナーのアンケート質問回答
- **状態**: ✅ 開発完了
- **GAS URL**: https://script.google.com/d/1bZ2WeL_7bbrYErTThJqfqSvcdBzigbIKEATNdMYUcauUiRpVl9auz3Gz/edit

### 03_WeekendEnt
- **対象**: WeekendEntセミナーのアンケート質問回答
- **状態**: ✅ 開発完了
- **GAS URL**: https://script.google.com/d/1JzZSAiEYQh2R_uFfxmqdBbDDrbDlfyXpdawh7fTwDaLaJFLap1o0gHul/edit

## 技術仕様
- Google Apps Script (GAS)
- OpenAI API (GPT-4o-mini)
- Gmail API
- Google Spreadsheet API

## 開発者
2025年6月9日 初版作成