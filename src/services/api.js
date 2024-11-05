// src/services/api.js
const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
  // サインアップ関数
  signup: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.userId,
          password: userData.password,
          familynum: userData.familyNum
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '登録に失敗しました');
      }
      
      return response.json();
    } catch (error) {
      console.error('サインアップエラー:', error);
      throw error;
    }
  },

  addItem: async (item) => {
    try {
      // Spanをdate型に変換
      const spanDate = new Date();
      spanDate.setDate(spanDate.getDate() + (item.Span || 60)); // デフォルト60日

      const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...item,
          Span: spanDate.toISOString().split('T')[0]
        }),
      });
      
      if (!response.ok) {
        throw new Error('商品追加エラー');
      }
      
      return response.json();
    } catch (error) {
      console.error('商品追加エラー:', error);
      throw error;
    }
  },

  // 認証関連
  login: async (username, password) => {
    try {
      console.log('ログインリクエスト送信:', { username, password });  // デバッグ用

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'ログインに失敗しました');
      }
      
      console.log('ログイン成功レスポンス:', data);  // デバッグ用
      return data;
    } catch (error) {
      console.error('ログインエラー:', error);
      throw error;
    }
  },

  // 商品関連
  getItems: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${userId}`);
      if (!response.ok) {
        throw new Error('商品取得エラー');
      }
      return response.json();
    } catch (error) {
      console.error('商品取得エラー:', error);
      throw error;
    }
  },

  updateLastPurchase: async (itemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${itemId}/lastPurchase`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('更新エラー');
      }
      
      return response.json();
    } catch (error) {
      console.error('最終購入日更新エラー:', error);
      throw error;
    }
  },
};