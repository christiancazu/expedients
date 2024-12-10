export default function setupNotificationPermission() {
  if (Notification.permission === 'granted') {
    console.log('notification granted')
  } else if(Notification.permission !== 'denied') {
    console.log('request notification')
    Notification.requestPermission().then((permission) => {
      console.log(`notification ${permission}`)
      window.parent.postMessage(permission)
    })
  }
}
