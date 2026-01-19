// Service Worker for Push Notifications
// Version: 2.0.0 - Force update
const SW_VERSION = "2.0.0";
console.log(`[SW] Service Worker v${SW_VERSION} loaded`);

self.addEventListener("install", (event) => {
    console.log(`[SW] Installing v${SW_VERSION}...`);
    self.skipWaiting(); // Force activation
});

self.addEventListener("activate", (event) => {
    console.log(`[SW] Activated v${SW_VERSION}`);
    event.waitUntil(clients.claim()); // Take control immediately
});

self.addEventListener("push", (event) => {
    console.log("[SW] Push event modtaget:", event);

    let data;
    try {
        data = event.data ? event.data.json() : { title: "Ny besked", body: "" };
        console.log("[SW] Push data parsed:", data);
    } catch (e) {
        console.error("[SW] Fejl ved parsing af push data:", e);
        data = { title: "Ny besked", body: "" };
    }

    const options = {
        body: data.body,
        icon: "/icon-192x192.png",
        badge: "/icon-192x192.png",
        tag: data.tag || "default",
        requireInteraction: false,
        vibrate: [200, 100, 200],
    };

    console.log("[SW] Viser notification med options:", options);

    event.waitUntil(
        self.registration.showNotification(data.title, options)
            .then(() => console.log("[SW] Notification vist succesfuldt"))
            .catch((err) => console.error("[SW] Fejl ved visning af notification:", err))
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
        clients
            .matchAll({ type: "window", includeUncontrolled: true })
            .then((clientList) => {
                // Hvis der allerede er et åbent vindue, fokusér på det
                for (const client of clientList) {
                    if (client.url === "/" && "focus" in client) {
                        return client.focus();
                    }
                }
                // Ellers åbn et nyt vindue
                if (clients.openWindow) {
                    return clients.openWindow("/");
                }
            })
    );
});