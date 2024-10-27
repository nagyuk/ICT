# ICT
①ターミナルを開いて、"npm start"と入力すると、App.jsの画面が開かれる。
②基本はdevelopで開発を行い、キリのいいところでmainに変更を加える。

ディレクトリ構造
ICT/
├── public/
│   ├── index.html
│   └── Sw.js
├── src/
│   ├── components/          # 新規作成
│   │   └── Navigation.js    # 共通コンポーネント
│   ├── services/           # 新規作成
│   │   └── api.js          # API・モックデータ管理
│   ├── App.js
│   ├── Home.js
│   ├── Log.js
│   ├── Manage.js
│   ├── Person.js
│   ├── index.js
│   └── ServiceWorkerRegistration.js
├── .gitignore
└── package.json

keywords:React, Node.js, 