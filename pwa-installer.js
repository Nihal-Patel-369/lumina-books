// PWA SERVICE WORKER REGISTRATION
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('✅ Service Worker registered successfully:', registration.scope);

                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New service worker available, show update notification
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch((error) => {
                console.log('❌ Service Worker registration failed:', error);
            });
    });
}

// Show update notification
function showUpdateNotification() {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Update Available!',
            text: 'A new version of Lumina Books is available. Refresh to update?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Refresh Now',
            cancelButtonText: 'Later',
            confirmButtonColor: '#8b5cf6'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        });
    }
}

// Install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;

    // Show install button/banner
    showInstallPromotion();
});

function showInstallPromotion() {
    // Create install button if it doesn't exist
    if (!document.getElementById('install-btn') && typeof Swal !== 'undefined') {
        setTimeout(() => {
            Swal.fire({
                title: '📱 Install Lumina Books',
                text: 'Install our app for a better experience! Access books offline and get faster loading times.',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Install Now',
                cancelButtonText: 'Maybe Later',
                confirmButtonColor: '#8b5cf6',
                imageUrl: 'icons/icon-192x192.png',
                imageWidth: 100,
                imageHeight: 100
            }).then((result) => {
                if (result.isConfirmed) {
                    installPWA();
                }
            });
        }, 3000); // Show after 3 seconds
    }
}

async function installPWA() {
    if (!deferredPrompt) {
        return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
        console.log('✅ PWA installed successfully');
    } else {
        console.log('❌ PWA installation declined');
    }

    // Clear the deferredPrompt
    deferredPrompt = null;
}

// Track installation
window.addEventListener('appinstalled', () => {
    console.log('✅ Lumina Books PWA installed!');
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Successfully Installed!',
            text: 'Lumina Books is now installed on your device.',
            icon: 'success',
            confirmButtonColor: '#8b5cf6',
            timer: 3000
        });
    }
});

console.log('📱 PWA features enabled');
