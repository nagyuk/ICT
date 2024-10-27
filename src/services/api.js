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
      Span: new Date("2024-10-22"),
      Lastday: new Date("2024-09-22")
    },
    {
      UID: 1,
      Item: "トイレットペーパー",
      Span: new Date("2024-11-05"),
      Lastday: new Date("2024-09-15")
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
    // 実際のAPIではユーザー情報を更新
    return { ...mockData.user, ...userData };
  },

  // 商品関連
  getItems: async (userId) => {
    return mockData.items.filter(item => item.UID === userId);
  },

  addItem: async (item) => {
    mockData.items.push({
      ...item,
      Lastday: new Date()
    });
    return item;
  },

  updateLastPurchase: async (userId, itemName) => {
    const item = mockData.items.find(
      i => i.UID === userId && i.Item === itemName
    );
    if (item) {
      item.Lastday = new Date();
    }
    return item;
  }
};