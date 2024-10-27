// シンプルな通知サービス
export const notificationService = {
  // 通知の許可を要求
  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('このブラウザは通知をサポートしていません');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('通知の許可の要求に失敗しました:', error);
      return false;
    }
  },

  // 日数の計算
  calculateDaysUntilReplacement(item) {
    const today = new Date();
    const lastPurchase = new Date(item.Lastday);
    const span = new Date(item.Span);
    const daysSinceLastPurchase = Math.floor(
      (today - lastPurchase) / (1000 * 60 * 60 * 24)
    );
    const replacementCycle = Math.floor(
      (span - new Date(0)) / (1000 * 60 * 60 * 24)
    );
    return replacementCycle - daysSinceLastPurchase;
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
      requireInteraction: true // 通知が自動で消えないようにする
    });
  },

  // 商品をチェックして通知
  async checkItemsAndNotify(items) {
    items.forEach(item => {
      const daysRemaining = this.calculateDaysUntilReplacement(item);
      
      // 残り3日以内または期限切れの場合に通知
      if (daysRemaining <= 3) {
        this.sendNotification(item, daysRemaining);
      }
    });
  }
};