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
cd 01_お問い合わせ
clasp create --title "AIDraft-お問い合わせ"
clasp push
```

#### 📊 02_単発
```bash
cd ../02_単発
clasp create --title "AIDraft-単発"
clasp push
```

#### 📈 03_WeekendEnt
```bash
cd ../03_WeekendEnt
clasp create --title "AIDraft-WeekendEnt"
clasp push
```

#### 📧 04_Gmailラベル自動回答
```bash
cd ../04_Gmailラベル自動回答
clasp create --title "AIDraft-Gmail"
clasp push
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

#### ⚙️ 各プロジェクトのconfig.js修正する
```javascript
// 01_お問い合わせ/src/config/config.js
const CONFIG = {
  SPREADSHEET_ID: "159ftLgPcrqdQU-W5UqpPcgrrZGado12kocXGFVnhzXI",
  SHEET_NAME: "お問い合わせ"
};

// 02_単発/src/config/config.js
const CONFIG = {
  SPREADSHEET_ID: "1PPwXbBGdSLIC8yeQY33dNDlEqjdJ4X-PibaDPiWU6Io",
  SHEET_NAME: "単発"
};

// 03_WeekendEnt/src/config/config.js
const CONFIG = {
  SPREADSHEET_ID: "1PPwXbBGdSLIC8yeQY33dNDlEqjdJ4X-PibaDPiWU6Io", // 02と同じ
  SHEET_NAME: "WeekendEnt"
};
```

#### 🚀 設定反映する
```bash
# 各プロジェクトで実行する
clasp push
```

### 5. ⚙️ 初期設定・動作確認する
1. 🔑 OpenAI APIキーを設定する（クライアントアカウント内）
2. ✅ 権限を許可する
3. 🧪 テスト実行を確認する
4. ✅ 動作確認を完了する

### 6. 🔒 セキュリティ対応する
1. 🚪 **クライアントアカウントからログアウトする**
   ```bash
   clasp logout
   ```
2. 🔐 **クライアントにパスワード変更を依頼する**
3. 📋 **作業完了報告をする**

## ⏱️ 作業時間
- 🔧 **準備**: 5分で完了
- 🏗️ **作成・デプロイ**: 40分で完了（10分×4）
- 📊 **スプレッドシート接続**: 15分で完了
- ⚙️ **設定・動作確認**: 20分で完了
- 🔒 **セキュリティ対応**: 5分で完了
- 🎯 **合計**: 約85分で完了

## ⚠️ 重要な注意事項

🔒 **セキュリティ関連**
- 🔑 作業中はクライアントアカウントに一時的にアクセスします
- 🚪 作業完了後は必ずログアウトします
- 🔐 クライアントには即座にパスワード変更を依頼します

📋 **技術的注意事項**
- 💾 作業前にローカルコードのバックアップを取ります
- 🔗 各プロジェクトのURLを記録・共有します
- 🆔 スプレッドシートIDの事前確認をします