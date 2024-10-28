// モックデータ
const mockData = {
  user: {
    UID: 1,
    Name: "山田太郎",
    Password: "career2024",
    Familynum: 4
  },
  items: [
    {
      UID: 1,
      Item: "おむつ",
      Span: 30, // 日数として保存
      Lastday: "2024-09-22" // ISO文字列として保存
    },
    {
      UID: 1,
      Item: "トイレットペーパー",
      Span: 45, // 日数として保存
      Lastday: "2024-09-15" // ISO文字列として保存
    }
  ]
};

export const api = {
  // 認証関連
  login: async (username, password) => {
    if (username === "jobhunter" && password === "career2024") {
      return mockData.user;
    }
    throw new Error("Invalid credentials");
  },

  updateUser: async (userId, userData) => {
    return { ...mockData.user, ...userData };
  },

  // 商品関連
  getItems: async (userId) => {
    return mockData.items.filter(item => item.UID === userId);
  },

  addItem: async (item) => {
    mockData.items.push({
      ...item,
      Lastday: new Date().toISOString().split('T')[0] // YYYY-MM-DD形式で保存
    });
    return item;
  },

  updateLastPurchase: async (userId, itemName) => {
    const item = mockData.items.find(
      i => i.UID === userId && i.Item === itemName
    );
    if (item) {
      item.Lastday = new Date().toISOString().split('T')[0]; // YYYY-MM-DD形式で更新
    }
    return item;
  }
};