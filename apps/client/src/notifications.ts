export default function setupNotificationPermission() {
  if (Notification.permission === 'granted') {
    console.log('notification granted')
  } else if(Notification.permission !== 'denied') {
    console.log('notification denied')
    Notification.requestPermission().then((permission) => {
      window.parent.postMessage(permission)
    })
  }
}
