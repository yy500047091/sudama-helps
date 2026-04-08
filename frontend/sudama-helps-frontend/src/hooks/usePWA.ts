import { useEffect } from 'react';

export const usePWA = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('ServiceWorker registration successful:', registration.scope);
        })
        .catch((error) => {
          console.log('ServiceWorker registration failed:', error);
        });
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // Show install button if needed
      console.log('App can be installed');
    };

    const handleAppInstalled = () => {
      console.log('App was installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);
};

export const requestNotificationPermission = async () => {
  if (!('serviceWorker' in navigator) || !('Notification' in window)) {
    console.log('Notifications not supported');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return false;
  }
};

export const sendNotification = async (title: string, options?: NotificationOptions) => {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%230ea5e9" width="192" height="192"/><text x="96" y="96" font-size="80" font-weight="bold" text-anchor="middle" dy="0.3em" fill="white">🏠</text></svg>',
      badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%230ea5e9" width="192" height="192"/></svg>',
      ...options,
    });
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};

export const subscribeToNotifications = async (subscription: PushSubscription) => {
  try {
    // In a real app, send this to your backend
    console.log('Subscription object:', subscription);
    return true;
  } catch (error) {
    console.error('Failed to subscribe:', error);
    return false;
  }
};
