/**
 * Utility funktioner til push notifications
 */

/**
 * Konverterer en VAPID public key fra base64 URL-safe format til Uint8Array
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Subscriber til push notifications
 * @param publicVapidKey - VAPID public key fra environment variabel
 * @returns PushSubscription objekt eller null hvis permission ikke er givet
 */
export async function subscribeToPush(
  publicVapidKey: string
): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Push notifications er ikke understøttet i denne browser");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    // Spørg om tilladelse
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission ikke givet");
      return null;
    }

    // Tjek om der allerede er en subscription
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Opret ny subscription
      const keyArray = urlBase64ToUint8Array(publicVapidKey);
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: keyArray as BufferSource,
      });
    }

    return subscription;
  } catch (error) {
    console.error("Fejl ved subscription til push notifications:", error);
    return null;
  }
}

/**
 * Henter den nuværende push subscription
 */
export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch (error) {
    console.error("Fejl ved hentning af subscription:", error);
    return null;
  }
}

/**
 * Unsubscriber fra push notifications
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      return true;
    }

    return false;
  } catch (error) {
    console.error("Fejl ved unsubscribe:", error);
    return false;
  }
}
