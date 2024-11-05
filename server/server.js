// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'ICTuser',
  password: 'f4',
  database: 's4',
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('データベース接続エラー:', err);
    return;
  }
  console.log('データベースに接続しました');
});

// server.js のログイン処理部分を修正
app.post('/api/login', (req, res) => {
  console.log('ログインリクエスト受信:', req.body);  // リクエストの確認
  
  const { username, password } = req.body;
  
  // 入力値の検証
  if (!username || !password) {
    console.log('バリデーションエラー:', { username, password });
    return res.status(400).json({ error: 'ユーザー名とパスワードは必須です' });
  }

  // ユーザー検索クエリを修正
  const query = 'SELECT * FROM User WHERE Name = ? AND Password = ?';
  console.log('実行するクエリ:', query, [username, password]);  // クエリの確認

  connection.query(
    query,
    [username, password],
    (error, results) => {
      if (error) {
        console.error('データベースエラー:', error);
        return res.status(500).json({ error: 'サーバーエラーが発生しました' });
      }
      
      console.log('検索結果:', results);  // 結果の確認
      
      if (results.length === 0) {
        return res.status(401).json({ error: 'ユーザー名またはパスワードが違います' });
      }

      const user = results[0];
      console.log('ログイン成功:', user);  // ログイン成功の確認
      
      res.json({
        UID: user.UID,
        Name: user.Name,
        Familynum: user.Familynum
      });
    }
  );
});

// サインアップAPI
app.post('/api/signup', (req, res) => {
  const { username, password, familynum } = req.body;
  
  if (!username || !password || !familynum) {
    return res.status(400).json({ error: '必須項目が入力されていません' });
  }

  // ユーザー名の長さチェック
  if (username.length > 16 || password.length > 16) {
    return res.status(400).json({ error: 'ユーザー名とパスワードは16文字以内である必要があります' });
  }

  connection.query(
    'SELECT * FROM User WHERE Name = ?',
    [username],
    (error, results) => {
      if (error) {
        console.error('データベースエラー:', error);
        return res.status(500).json({ error: 'サーバーエラーが発生しました' });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ error: 'このユーザー名は既に使用されています' });
      }
      
      connection.query(
        'INSERT INTO User (Name, Password, Familynum) VALUES (?, ?, ?)',
        [username, password, familynum],
        (error, results) => {
          if (error) {
            console.error('ユーザー登録エラー:', error);
            return res.status(500).json({ error: 'サーバーエラーが発生しました' });
          }
          
          res.status(201).json({
            UID: results.insertId,
            Name: username,
            Familynum: familynum
          });
        }
      );
    }
  );
});

// 商品追加API
app.post('/api/items', (req, res) => {
  const { UID, Item, Span } = req.body;
  const today = new Date().toISOString().split('T')[0];
  
  connection.query(
    'INSERT INTO Items (UID, Item, Span, Lastday) VALUES (?, ?, ?, ?)',
    [UID, Item, Span, today],
    (error, results) => {
      if (error) {
        console.error('商品追加エラー:', error);
        return res.status(500).json({ error: 'サーバーエラーが発生しました' });
      }
      res.json({ 
        UID,
        Item,
        Span,
        Lastday: today
      });
    }
  );
});

// 商品一覧取得API
app.get('/api/items/:userId', (req, res) => {
  const userId = req.params.userId;
  
  connection.query(
    'SELECT * FROM Items WHERE UID = ?',
    [userId],
    (error, results) => {
      if (error) {
        console.error('商品取得エラー:', error);
        return res.status(500).json({ error: 'サーバーエラーが発生しました' });
      }
      res.json(results);
    }
  );
});

// 最終購入日更新API
app.put('/api/items/:itemId/lastPurchase', (req, res) => {
  const itemId = req.params.itemId;
  const today = new Date().toISOString().split('T')[0];
  
  connection.query(
    'UPDATE Items SET Lastday = ? WHERE Item = ? AND UID = ?',
    [today, itemId, req.body.UID],
    (error) => {
      if (error) {
        console.error('更新エラー:', error);
        return res.status(500).json({ error: 'サーバーエラーが発生しました' });
      }
      res.json({ 
        success: true, 
        Lastday: today 
      });
    }
  );
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました`);
});