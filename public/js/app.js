// Register Service Worker
if('serviceWorker' in navigator) {
    console.log('INFO - Service Worker Supported')
    navigator.serviceWorker.register('/service-worker.js').then(response => {
        console.log('SW Register Status ->', response?.active?.state)
    }).catch(error => {
        console.log('SW Register Error ->', error)
    })
} else {
    console.log('WARN - Service worker not supported')
}