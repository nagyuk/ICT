# Kaimono Seisei Application プロジェクト概要

日用品や消耗品の購入時期を管理し、適切なタイミングで購入を促すWebアプリケーションの開発。

## セットアップ手順

1. フロントエンド起動
```bash
npm start  # React開発サーバーが起動（ポート3000）
```

2. バックエンド起動
```bash
cd server
npm install  # 初回のみ
node server.js  # サーバーが起動（ポート8000）
```

## 技術スタック
- フロントエンド: React, Chakra UI
- バックエンド: Node.js, Express
- データベース: MySQL (XAMPP)
- 開発環境: localhost

## データベース設定
- Host: localhost
- User: ICTuser
- Password: f4
- Database: s4
- Port: 3306

## ディレクトリ構造
```
ICT/
├── server/
│   ├── node_modules/
│   ├── package.json
│   └── server.js
├── public/
│   ├── index.html
│   └── Sw.js
├── src/
│   ├── components/
│   │   └── Navigation.js
│   ├── services/
│   │   ├── api.js
│   │   └── notification.js
│   ├── App.js
│   ├── Home.js
│   ├── Log.js
│   ├── Manage.js
│   ├── Person.js
│   └── index.js
└── package.json
```

## 主要コンポーネント
- App.js: メインコンポーネント、ルーティング管理
- Home.js: ホーム画面、商品一覧表示
- Manage.js: 商品登録管理
- Log.js: 購入履歴管理
- Person.js: ユーザー情報管理

## 実装機能
1. 基本機能
   - ユーザー認証
   - 商品管理（登録、削除、更新）
   - 購入履歴管理
   - ブラウザ通知機能

2. API一覧
   - POST /api/signup - ユーザー登録
   - POST /api/login - ログイン
   - GET /api/items/:userId - 商品一覧取得
   - POST /api/items - 商品追加
   - PUT /api/items/:itemId/lastPurchase - 最終購入日更新

## データ構造
```javascript
// ユーザー情報
User {
  UID: number;
  Name: string;
  Password: string;
  Familynum: number;
}

// 商品情報
Item {
  UID: number;
  Item: string;
  Span: Date;
  Lastday: Date;
}
```

## 開発方針
1. 学習目的のプロジェクト
2. 段階的な機能追加
3. 基本機能の充実を優先
4. developブランチで開発を行い、キリのいいところでmainに変更を加える

## テスト用アカウント
- ユーザー名: jobhunter
- パスワード: career2024

## 今後の課題
1. ユーザビリティの向上
2. 追加機能の検討
3. ブラウザ通知の本番環境対応

## 開発環境
- Node.js v20.17.0
- React 18.x
- MySQL 8.0
- XAMPP