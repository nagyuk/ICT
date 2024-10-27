# Kaimono Seisei Application プロジェクト概要

## プロジェクトの目的
日用品や消耗品の購入時期を管理し、適切なタイミングで購入を促すWebアプリケーションの開発。

## 技術スタック
- フロントエンド: React, Chakra UI
- 開発環境: localhost
- 将来的な予定: MySQLによるバックエンド実装

## 現在の実装状態
1. 基本機能
   - ユーザー認証（モックデータ使用）
   - 商品管理（登録、削除、更新）
   - 購入履歴管理
   - ブラウザ通知機能

2. ディレクトリ構造
```
ICT/
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
```

3. 主要コンポーネント
- App.js: メインコンポーネント、ルーティング管理
- Home.js: ホーム画面、商品一覧表示
- Manage.js: 商品登録管理
- Log.js: 購入履歴管理
- Person.js: ユーザー情報管理

4. データ構造
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

## 現在の課題・検討事項
1. バックエンド未実装
   - 現在はモックデータを使用
   - MySQLでの実装を予定

2. 認証システム
   - 基本的な認証機能のみ実装
   - セキュリティ強化が必要

3. ブラウザ通知
   - localhost環境での簡易実装
   - 本番環境での実装方針検討が必要

## 開発方針
1. 学習目的のプロジェクト
2. 段階的な機能追加
3. 基本機能の充実を優先

## アクセス情報
- テストユーザー: jobhunter
- テストパスワード: career2024

## 次回の検討課題
1. バックエンド実装計画
2. ユーザビリティの向上
3. 追加機能の検討
