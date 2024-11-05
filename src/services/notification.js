// シンプルな通知サービス
const NOTIFICATION_PERMISSION_KEY = 'notificationPermissionGranted';

// 通知済みアイテムを追跡
const notifiedItems = new Set();  

export const notificationService = {
  // 通知の許可状態を確認
  hasPermissionStored() {
    return localStorage.getItem(NOTIFICATION_PERMISSION_KEY) === 'true';
  },

  // 通知の許可状態を保存
  storePermissionStatus(granted) {
    localStorage.setItem(NOTIFICATION_PERMISSION_KEY, granted);
  },

  // 通知の許可を要求
  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('このブラウザは通知をサポートしていません');
      return false;
    }

    // すでに許可されている場合は確認をスキップ
    if (Notification.permission === 'granted' && this.hasPermissionStored()) {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      this.storePermissionStatus(granted);
      return granted;
    } catch (error) {
      console.error('通知の許可の要求に失敗しました:', error);
      return false;
    }
  },

  // 日数の計算
  calculateDaysUntilReplacement(item) {
    if (!item.Lastday) return item.Span;

    const today = new Date();
    const lastPurchase = new Date(item.Lastday);
    const daysSinceLastPurchase = Math.floor(
      (today - lastPurchase) / (1000 * 60 * 60 * 24)
    );
    return item.Span - daysSinceLastPurchase;
  },

  // 通知を送信
  async sendNotification(item, daysRemaining) {
    if (Notification.permission !== 'granted') {
      return;
    }

    const message = daysRemaining <= 0 
      ? `${item.Item}の交換時期が過ぎています。`
      : `${item.Item}の交換まであと${daysRemaining}日です。`;

    new Notification('買い物通知', {
      body: message,
      requireInteraction: true
    });
  },

  // 商品をチェックして通知
  async checkItemsAndNotify(items) {
    // 通知が許可されていない場合はチェックをスキップ
    if (Notification.permission !== 'granted') {
      return;
    }

    items.forEach(item => {
      if(!notifiedItems.has(item.Item)){
      const daysRemaining = this.calculateDaysUntilReplacement(item);
      if (daysRemaining <= 3) {
        this.sendNotification(item, daysRemaining);
      }
      notifiedItems.add(item.Item);  // 通知済みに設定
    }});
  }
};