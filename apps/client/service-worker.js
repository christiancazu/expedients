self.addEventListener('install', () => {
  console.log('service worker installed')
  self.skipWaiting()
})


self.addEventListener('push', (e) => {
  console.log('push notification')
  const { title, body, redirectUrl } = e.data.json()

  self.registration.showNotification(title, {
    body,
    data: { redirectUrl },
    icon: 'https://corporativokallpa.com/favicon.svg',
    badge: 'https://corporativokallpa.com/favicon.svg'
  })
})

self.addEventListener('notificationclick', function (event) {
  console.log('on notification click: ', event.notification.data)
  event.notification.close()

  event.waitUntil(
    clients
      .matchAll({
        type: 'window'
      })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) return client.focus()
        }
        if (clients.openWindow) return clients.openWindow(event.notification.data.redirectUrl)
      })
  )
})
