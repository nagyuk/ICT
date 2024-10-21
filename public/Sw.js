self.addEventListener('push', function(event) {
    const data = event.data.json();
    console.log('Push received:', data);
  
    const options = {
      body: data.body,
      icon: 'icon.png', // 任意のアイコン画像
      badge: 'badge.png', // 任意のバッジ画像
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  //Service Workerの略