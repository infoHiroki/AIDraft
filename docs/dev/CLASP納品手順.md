# 🚀 Clasp納品手順

## 📋 前提条件
- 🔧 Google Claspをインストールしておく
- 🔑 **クライアントのGoogleアカウント情報を一時的に共有してもらう**
- 💻 AIDraftプロジェクトコードを準備完了させておく

## 🔒 セキュリティ方針
⚠️ **アカウント情報の一時共有が必要になります**
- 📊 GAS納品では既存アカウントでの作業が必須となります
- 🔐 作業完了後にクライアントにパスワード変更をしてもらいます
- 🤝 信頼関係を前提とした業界標準手法を採用しています

## 🎯 納品ステップ

### 1. 🔑 クライアントアカウントでログインする
```bash
# 現在のアカウントからログアウトする
clasp logout

# クライアントアカウントでログインする（一時的に共有されたアカウント情報を使用）
clasp login
```

### 2. 🏗️ プロジェクト作成・デプロイする

#### 📝 01_お問い合わせ
```bash
cd "01_お問い合わせ"
# 既存プロジェクトがある場合は.clasp.jsonをバックアップ
mv .clasp.json .clasp.json.old
clasp create --title "AIDraft-お問い合わせ" --type standalone
clasp push
```

#### 📊 02_単発（動的列検索機能付き）
```bash
cd "../02_単発"
mv .clasp.json .clasp.json.old
clasp create --title "AIDraft-単発" --type standalone
clasp push
```

#### 📈 03_WeekendEnt（動的列検索機能付き）
```bash
cd "../03_WeekendEnt"
mv .clasp.json .clasp.json.old
clasp create --title "AIDraft-WeekendEnt" --type standalone
clasp push
```

#### 📧 04_Gmailラベル自動回答（新仕様・未実装）
⚠️ **仕様変更により再設計中**
```bash
# 現在は実装停止中
# 新仕様確定後に実装予定
```

### 3. 🔗 プロジェクトURL確認する
```bash
# 各プロジェクトで実行する
clasp open
```
📤 URLをクライアントに共有する

### 4. 📊 スプレッドシート接続設定をする

#### 🆔 クライアントのスプレッドシートID取得する
- 📝 **お問い合わせ用**: `159ftLgPcrqdQU-W5UqpPcgrrZGado12kocXGFVnhzXI`
- 📋 **アンケート用**: `1PPwXbBGdSLIC8yeQY33dNDlEqjdJ4X-PibaDPiWU6Io`（単発・WeekendEnt共通）

#### ⚙️ 各プロジェクトのsheets.js修正する
```javascript
// 01_お問い合わせ/src/config/sheets.js
// DENTAL_SEMINAR.SHEET_IDを更新
SHEET_ID: '159ftLgPcrqdQU-W5UqpPcgrrZGado12kocXGFVnhzXI',

// 02_単発/src/config/sheets.js
// TANBATSU.SHEET_IDを更新
SHEET_ID: '1PPwXbBGdSLIC8yeQY33dNDlEqjdJ4X-PibaDPiWU6Io',

// 03_WeekendEnt/src/config/sheets.js
// WEEKEND_ENT.SHEET_IDを更新、シート名も修正
SHEET_ID: '1PPwXbBGdSLIC8yeQY33dNDlEqjdJ4X-PibaDPiWU6Io',
SHEET_NAME: 'WeekenDent', // 実際のシート名に合わせる
```

#### 🚀 設定反映する
```bash
# 各プロジェクトで実行する
clasp push
```

### 5. ⚙️ 初期設定・動作確認する
1. 🔑 **OpenAI APIキー設定**
   - スクリプトプロパティに `OPENAI_API_KEY` を追加
   - 各プロジェクトで設定が必要

2. 📊 **スプレッドシート共有設定**
   - 対象スプレッドシートを `globaldental.seminar@gmail.com` に「編集者」権限で共有
   - Apps Script APIを有効化: https://script.google.com/home/usersettings

3. 🧪 **テスト実行**
   - 01_お問い合わせ: `testSingleRow()` 関数を実行
   - 02_単発: `testProcessing()` 関数を実行
   - 03_WeekendEnt: `testProcessing()` 関数を実行（動的列検索機能付き）

4. ✅ **動作確認完了**
   - 各テストで「0件処理」または正常処理を確認

### 6. 🔒 セキュリティ対応する
1. 🚪 **クライアントアカウントからログアウトする**
   ```bash
   clasp logout
   ```
2. 🔐 **クライアントにパスワード変更を依頼する**
3. 📋 **作業完了報告をする**

## ⏱️ 作業時間
- 🔧 **準備**: 5分で完了
- 🏗️ **作成・デプロイ**: 30分で完了（10分×3プロジェクト）
- 📊 **スプレッドシート接続**: 15分で完了
- ⚙️ **設定・動作確認**: 20分で完了
- 🔒 **セキュリティ対応**: 5分で完了
- 🎯 **合計**: 約75分で完了（04_Gmail除く）

## ⚠️ 重要な注意事項

🔒 **セキュリティ関連**
- 🔑 作業中はクライアントアカウントに一時的にアクセスします
- 🚪 作業完了後は必ずログアウトします
- 🔐 クライアントには即座にパスワード変更を依頼します

📋 **技術的注意事項**
- 💾 作業前にローカルコードのバックアップを取ります
- 🔗 各プロジェクトのURLを記録・共有します
- 🆔 スプレッドシートIDの事前確認をします
- 🔄 **03_WeekendEnt**: 動的列検索機能により、フォーム質問追加に自動対応
- ⚠️ **04_Gmail**: 仕様変更により現在は未実装（再設計中）